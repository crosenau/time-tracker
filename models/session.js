'use strict';

const getDb = require('../db').getDb;

const collection = 'sessions';

async function save(docs) {
  const db = getDb();

  try {
    const result = await db.collection(collection).insertMany(docs);

    return result.ops;
  } catch(err) {
    throw(err);
  }
}

module.exports = {
  save
};