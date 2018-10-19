#!/usr/bin/env node
(async function () {
	'use script';
	process.on('uncaughtException', err => {
		console.error('got an error: %s', err);
		process.exitCode = 1;
	});

	const updateNotifier = require('update-notifier');
	const whatTime = require('what-time');
	const minimatch = require('minimatch');
	const async = require('async');
	const fs = require('fs');
	const path = require('path');
	const listMd = require('./src/util/readmd.js');
	const meow = require('meow');

	const mergeConfig = require('./src/config/mergeConfig.js');

	const {g, y, yow, m, b, r, relaPath, insert_flg} = require('./src/util/util.js');

	// Cli cmd
	const cli = meow(`
Usage
  $ translateMds [folder/file name] [options]

Example
  $ translateMds md/

  ${b('[options]')}
  ${g('-a   API')}      : default < baidu > ${y('{google|baidu|youdao}')}
  ${g('-f   from ')}    : default < auto detect >
  ${g('-t   to   ')}    : default < zh >
  ${g('-N   num  ')}    : default < 1 > ${y('{async number}')}
  ${g('-R   rewrite')}  : default < false > ${y('{yes/no rewrite translate file}')}

🌟${m('[high user options]')}❤️

  ${g('-D   debug')}
  ${g('-G   google.com')}       : default: false  ${y('{ cn => com with Google api }')}
  ${g('-F   force')}            : default: false  ${y('{ If, translate result is no 100%, force wirte md file }')}
  ${g('-M   match')}            : default [ ". ", "! "//...] ${y('{match this str, merge translate result }')}
  ${g('-S   skips')}            : default ["... ", "etc. ", "i.e. "] ${y('{match this str will, skip merge translate result }')}
  ${g('-T   types')}            : default ["html", "code"] ${y('{pass the md AST type}')}
  ${g('--timewait ')}           : default < 80 > ${y('{each fetch api wait time}')}
  ${g('--values [path]')}       : default: false ${y('{write the original of wait for translate file}')} ${r('[single file]')}
  ${g('--translate [path]')}    : default: false ${y('{use this file translate}')} ${r('[single file]')}
  ${g('--text-glob [pattern]')} : default: false ${y('{text must be match, then be transalte}')}
  ${g('--glob [pattern]')}      : default: false ${y('{file must be match, then be transalte}')}
  ${g('--ignore [relative file/folder]')} : default: false ${y('{ignore files/folders string, split with `,` }')}

`);

	updateNotifier({pkg: cli.pkg}).notify();

	// Fix write file Path is absoulte
	const dir = cli.input[0];
	if (!dir) {
    console.error(g('--> v' + cli.pkg.version), cli.help);
    process.exit(1);
	}

	// Merge config
	const {
		debug,
		tranFr,
		tranTo,
		api,
		rewrite,
		asyncNum,
		Force,
        ignores,
        glob
	} = mergeConfig(cli);

	const translateMds = require('./src/translateMds.js');

	const {loggerStart, loggerText, loggerStop, oneOra} = require('./src/config/loggerConfig.js'); // Winston config

	// after workOptions ready
	const {writeDataToFile} = require('./src/util/writeDataToFile.js');

	console.log(b('Starting 翻译') + r(dir));

	// Get floder markdown files Array
	const getList = await listMd(path.resolve(process.cwd(), dir), {deep: 'all'});

	console.log(b(`总文件数 ${getList.length}, 有些文件会跳过`));

	let Done = 0;
	const noDone = [];
	let showAsyncnum = 0;

	loggerStart('translate running ...');
	async.mapLimit(getList, asyncNum, runTranslate,
		(err, IsTranslateS) => {
			loggerStop();
			if (noDone.length > 0) {
				process.exitCode = 1;
			}
			if (err) {
				throw err;
			}

			Done++;
			if (IsTranslateS.every(x => Boolean(x))) {
				oneOra('All Done');
			} else {
				if (debug !== 'debug') {
					oneOra(`Some No Done , ${yow('use')} cli-option${r(' { -D } ')} find the Err`);
				}
				if (!Force) {
					oneOra(`Or ${yow('use')} cli-option${r(' { -F } ')} Force put the translate Result`);
				}
				if (debug === 'debug' || Force) {
					oneOra(`[${g('DEBUG')}:${debug === 'debug'}|${g('Force')}:${Force}] mode`);
				}
			}
			oneOra(`time:${whatTime(process.uptime())}`);
		}
	);

	/**
 * @description async Translate filename value , Return true or false
 * @param {String} value
 * @returns {Boolean}
 */

	async function runTranslate(value) {
		const rePath = relaPath(value);
		loggerText(`++++ <😊 > ${rePath}`);

		let State = true;
		Done++;

		const localDone = Done;

		// Filter same file
		if (value.endsWith(`.${tranTo}.md`) || !value.endsWith('.md')) {
			loggerText(b(`- 翻译的 - 或者 不是 md 文件的 ${g(rePath)}`));
			return State;
		}
		if (value.match(/\.[a-zA-Z]+\.md+/)) { // TOGO country short name
			loggerText(b(`- 有后缀为 *.国家简写.md  ${g(rePath)}`));
			return State;
		}
		if (!rewrite && fs.existsSync(insert_flg(value, `.${tranTo}`, 3))) {
			loggerText(b(`已翻译, 不覆盖 ${g(rePath)}`));
			return State;
		}
		if (glob && glob.some(g =>!minimatch(value, g, {matchBase: true})) ) {
			loggerText(b(`glob, no match ${g(rePath)}`));
			return State;
		}
		if (ignores && ignores.some(ignore => value.includes(path.resolve(ignore)))) {
			loggerText(b(`ignore, ${g(rePath)}`));
			return State;
		}

		loggerText(`1. do 第${localDone}文件 ${rePath}`);

		// Open async num
		showAsyncnum++;
		const startTime = new Date().getTime();

		const _translateMds = await translateMds([value, api, tranFr, tranTo], debug, true);

		// Succeed / force wirte data
		if (_translateMds.every(x => !x.error && x.text) || Force) { // Translate no ok
			const _tranData = _translateMds.map(x => x.text); // Single file translate data

			await writeDataToFile(_tranData, value).then(text => loggerText(text));
		}

		let Err;
		for (const _t of _translateMds) {
			if (_t.error) {
				Err = _t.error;
				break;
			}
		}

		const endtime = new Date().getTime() - startTime;
		const humanTime = whatTime(endtime / 1000);

		if (State && !Err) {
			oneOra(`已搞定 第 ${localDone} 文件 - 并发${b(showAsyncnum)} -- ${b(humanTime)} - ${rePath}`);
		} else {
			State = false; // Translate no ok
			if (!State) { // Write data no ok | translate no ok
				noDone.push(value); // If process exit code
				oneOra(`没完成 第 ${localDone} 文件 - 并发${b(showAsyncnum)} -- ${b(humanTime)} - ${rePath} \n ${Err}`, 'fail');
			}
		}

		showAsyncnum--;

		return State;
	}

	process.on('exit', _ => {
		loggerStop();
	});
})();
