var dbS = require('diskdb');
const path = require('path');

const localPath = () => path.join(__dirname, '../../disks');

function loadDisk(...filename) {
  let db = dbS.connect(
    localPath(),
    [...filename]
  );

  let options = {
    multi: false, // update multiple - default false
    upsert: true // if object is not found, add it (update-insert) - default false
  };

  function setDisk(key, q, obj) {
    return db[key].update(q, obj, options);
  }

  function getDisk(key, obj) {
    return db[key].findOne(obj);
  }

  return {setDisk, getDisk, db, path: db._db.path};
}

module.exports = loadDisk;
