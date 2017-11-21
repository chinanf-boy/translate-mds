const fs = require('mz/fs')
module.exports = async function writeJson(jsonFile, jsonObj) {
    return fs.writeFile(jsonFile, JSON.stringify(jsonObj, null, 2))
}