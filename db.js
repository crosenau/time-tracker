'use strict';

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const connectionString = require('./config/keys').connectionString;
const options = { useNewUrlParser: true };

let _db;

console.log('connectionString: ', connectionString);

async function initDb() {
  if (_db) {
    console.warn('Database connection alread initialized! Returning existing connection.');
    return _db;
  } else {
    try {
      const client = new MongoClient(connectionString, options);
      await client.connect();

      _db = client.db('fcc');
      return _db;
    }
    catch(err) {
      throw err;
    }
  }
}

function getDb() {
  assert.ok(_db, 'DB has not been initialized. Call initDb first');
  return _db;
}

module.exports = {
  getDb,
  initDb
};