'use strict';

const ObjectID = require('mongodb').ObjectID
const getDb = require('../db').getDb;

const collection = 'time-users';

async function find(query) {
  if (Object.keys(query).includes('_id') && ObjectID.isValid(query._id)) {
    query._id = ObjectID(query._id);
  }

  const db = getDb();

  try {
    const result = await db.collection(collection).findOne(query);

    return result;
  } catch(err) {
    throw err;
  }
}

async function save(user) {
  const db = getDb();

  try {
    const result = await db.collection(collection).insertOne(user);

    return result.ops.map(user => ({
      name: user.name,
      email: user.email
    }));
  } catch(err) {
    throw err;
  }
}

module.exports = {
  find,
  save
}