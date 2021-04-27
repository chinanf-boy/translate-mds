var dbS = require("diskdb");
const path = require("path");
const fs = require("fs");

const localPath = () => path.join(__dirname, "../../disks");

function loadDisk(...filename) {
  // fixed: missing path
  let lP = localPath();
  if (!fs.existsSync(lP)) {
    fs.mkdirSync(lP);
  }
  let db = dbS.connect(lP, [...filename]);

  let options = {
    multi: false, // update multiple - default false
    upsert: true, // if object is not found, add it (update-insert) - default false
  };

  function setDisk(key, q, obj) {
    return db[key].update(q, obj, options);
  }

  function getDisk(key, obj) {
    return db[key].findOne(obj);
  }

  return { setDisk, getDisk, db, path: db._db.path };
}

module.exports = loadDisk;
