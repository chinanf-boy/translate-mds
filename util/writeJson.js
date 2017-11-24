const fs = require('mz/fs')
module.exports = async function writeJson(jsonFile, jsonObj) {
    await fs.writeFile(jsonFile, JSON.stringify(jsonObj, null, 2))
}