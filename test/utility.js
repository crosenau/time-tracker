'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../server');
const User = require('../models/User');

chai.use(chaiHttp);

async function createTestUser() {
  const registerResponse = await chai.request(server)
  .post('/api/users/register')
  .send({
    name: 'Test User',
    email: 'test@test.com',
    password: 'testPassword',
    password2: 'testPassword'
  });

  expect(registerResponse.status).to.equal(200);
}

async function getJWT() {
  const loginResponse = await chai.request(server)
  .post('/api/users/login')
  .send({
    email: 'test@test.com',
    password: 'testPassword'
  });

  const data = JSON.parse(loginResponse.text);

  expect(data).to.be.an('object');
  expect(data).to.have.a.property('success');
  expect(data.success).to.be.true;
  expect(data).to.have.a.property('token');
  expect(data.token).to.be.a('string');
  expect(data.token).to.match(/^Bearer/);

  return data.token;
}

async function deleteTestUser() {
  const testUser = await User.findOneAndDelete({ email: 'test@test.com' });
  
  expect(testUser.name).to.equal('Test User');
}

module.exports = {
  createTestUser,
  getJWT,
  deleteTestUser
};