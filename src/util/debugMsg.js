const debug = require('debug')('mds:tran');
const {tc, g, y, yow, m, b, r} = require('./util.js');
const {
  logger,
  loggerStart,
  loggerText,
  oneOra
} = require('../config/loggerConfig.js');

module.exports = debugMsg = (step, valueArr, resArr) => {
  let BigOne = valueArr.length > resArr.length ? valueArr : resArr;
  let debugInfo = `-- source: ${valueArr.length}/${
    resArr.length
  }: translte ---`;
  if (resArr.length == 0) return;

  function tranSourceShow(debug) {
    for (let i in BigOne) {
      // Debug
      if (!valueArr[i] || !resArr[i]) {
        debug(
          `2. set- ${i} : ${g(valueArr[i])} ${tc.bgMagenta(
            'to->'
          )} ${i} : ${yow(resArr[i])}`
        );
      } else {
        debug(
          `2. set- ${i} : ${g(valueArr[i])} to->  ${i} : ${yow(resArr[i])}`
        );
      }
    }
  }

  if (step == 1) {
    if (debug.enabled) {
      // debug all
      debug(debugInfo);

      tranSourceShow(debug);
    } else {
      loggerText(debugInfo);
    }
  } else {
    loggerText(debugInfo);

    tranSourceShow(logger.debug);
  }
};
