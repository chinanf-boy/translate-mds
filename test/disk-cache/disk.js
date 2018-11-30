const {test} = require('ava');
const dbFunc = require('../../src/util/diskCache');

const DBname = 'test-disk';
let dbFace = dbFunc(DBname);
const OBJ = {author: 'name'};

test.serial('set obj', async t => {
  let res = await dbFace.setDisk(DBname, OBJ, OBJ);
  console.log(res);
  t.true(Object.keys(res).some(x => res[x] > 0));
});

test.serial('get obj', async t => {
  let res = await dbFace.getDisk(DBname);
  t.deepEqual(res.author, OBJ.author);
});
test.serial('db path', t => {
  t.true(dbFace.path.includes('disks'));
});
