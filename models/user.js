'use strict';

const getDb = require('../db').getDb;

const collection = 'time-users';

async function find(query) {
  const db = getDb();

  try {
    const result = await db.findOne(query);
    const user = {
      email: result.email,
      password: result.password
    };

    console.log('result: ', result);

    return user;
  } catch(err) {
    throw err;
  }
}

async function save(user) {
  const db = getDb();

  try {
    const result = await db.collection(collection).insertOne(user);
    console.log('result: ', result);

    if (result.ops.length === 0) {
      throw Error('Error registering new user');
    }

    return 'success';
  } catch(err) {
    throw err;
  }
}

module.exports = {
  find,
  save
}