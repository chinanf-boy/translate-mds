
// defaultConfig options
/**
 * @description 
 * @param {String|Boolean} option 
 * @param {Function} callback 
 * @param {any} args 
 * @returns {Function}
 */
function setDefault(option, callback, args){
    return callback(option, args)
}

/**
 * @description 
 * @param {String|Boolean} debug 
 * @param {any} args 
 * @returns {String}
 */
function debugTodo(debug, args){
  if(typeof debug == 'string'){
    args.logger.level = debug
    return debug
  }
  if(debug){
    args.logger.level = 'debug'
    return debug
  }
  return args.logger.level
}

/**
 * @description 
 * @param {String} tranFrom 
 * @param {any} args 
 * @returns {String}
 */
function fromTodo(tranFrom, args){
if(tranFrom){
  args.from = tranFrom
  return tranFrom
}
return args.from
}

/**
 * @description 
 * @param {String} tranTo 
 * @param {any} args 
 * @returns {String}
 */
function toTodo(tranTo, args){
if(tranTo){
  args.to = tranTo
  return tranTo
}
return args.to
}

/**
 * @description 
 * @param {number} num 
 * @param {any} args 
 * @returns {number}
 */
function numTodo(num, args){
  if(typeof num == 'number'){
    args.num = num
    return num
  }
  return args.num
}

/**
 * @description api {``baidu | google | youdao``}
 * @param {String} api 
 * @param {any} args 
 * @returns {String}
 */
function apiTodo(api, args){
  if(api){
    args.api = api
    return api
  }
  return args.api
}

/**
 * @description 
 * @param {Boolean} rewrite 
 * @param {any} args 
 * @returns {Boolean}
 */
function rewriteTodo(rewrite, args) {

  args.rewrite = rewrite? true : false
  return args.rewrite
}
module.exports = {setDefault, debugTodo, fromTodo, toTodo, apiTodo, rewriteTodo, numTodo }
