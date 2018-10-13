const {getOptions} = require('./config/work-options.js')
const TYPES = getOptions()['types']
let types = ['html', 'code'].concat(TYPES)
let sum = 0;

function getTypeValue(obj,tranArray){
    sum = 0;
	/**
	 * @description Find ``obj['type'] === 'value'`` ,and``tranArray.push(obj[key])``
	 * @param {Object} obj
	 * @param {String[]} tranArray
	 * @returns {number} - find value number
	 */
	function deep(obj, tranArray) {
		Object.keys(obj).forEach(function (key) {

			// no translate code content
			if (obj['type'] && (types.some(t => obj['type'] == t))) {
				return sum
			}
			(obj[key] && typeof obj[key] === 'object') && deep(obj[key], tranArray)


			if (key === 'value' && obj[key].trim()) {
				tranArray.push(obj[key])
				sum++
			}
		});
		return sum
    };

    return deep(obj,tranArray)
}
function setTypeValue(obj, tranArrayZh){
	/**
	 * @description Find ``obj['type'] === 'value'``, and use ``tranArrayZh.shift`` set ``obj['value']``
	 * @param {any} obj - AST
	 * @param {String[]} tranArrayZh
	 * @returns
	 */
	function setdeep(obj, tranArrayZh) {
		Object.keys(obj).forEach(function (key) {

			if (obj['type'] && (types.some(t => obj['type'] == t))) {
				return sum
			}

			(obj[key] && typeof obj[key] === 'object') && setdeep(obj[key], tranArrayZh)

			if (key === 'value' && obj[key].trim()) {
				if (tranArrayZh.length) {
					obj[key] = tranArrayZh.shift()
					sum--
				}
			}
		});
		return sum
    };

    return setdeep(obj, tranArrayZh)
}
module.exports = {
    getTypeValue,
    setTypeValue
}
