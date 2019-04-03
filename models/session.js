'use strict';

const getDb = require('../db').getDb;

const collection = 'sessions';

async function save(docs) {
  console.log('docs: ', docs);

  const db = getDb();

  const result = await db.collection(collection).insertMany(docs);
  console.log('result: ', result);
}

module.exports = {
  save
};