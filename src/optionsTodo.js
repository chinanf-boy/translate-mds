
// defaultConfig options
function setDefault(option, callback, args){
    return callback(option, args)
}

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

function fromTodo(tranFrom, args){
if(tranFrom){
  args.from = tranFrom
  return tranFrom
}
return args.from
}

function toTodo(tranTo, args){
if(tranTo){
  args.to = tranTo
  return tranTo
}
return args.to
}

function apiTodo(api, args){
  if(api){
    args.api = api
    return api
  }
  return args.api
}

module.exports = {setDefault, debugTodo, fromTodo, toTodo, apiTodo }
