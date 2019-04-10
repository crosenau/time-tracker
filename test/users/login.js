'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');
const User = require('../../models/User');

chai.use(chaiHttp);

describe('API ROUTING FOR /api/users/login', function () {
  before('create test user', async function() {
    const response = await chai.request(server)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'testPassword',
        password2: 'testPassword'
      });
    
  expect(response.status).to.equal(200);

  });

  context('with valid email and password', function () {
    it('should return a JSON string containing success status and token', async function () {
      const response = await chai.request(server)
        .post('/api/users/login')
        .send({
          email: 'test@test.com',
          password: 'testPassword'
        });

      expect(response.status).to.equal(200);
      expect(response.text).to.be.a('string');

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.a.property('success');
      expect(data.success).to.be.true;
      expect(data).to.have.a.property('token');
      expect(data.token).to.be.a('string');
      expect(data.token).to.match(/^Bearer/);
    });
  });

  context('missing email input', function () {
    it('should return a JSON string with missing email error', async function () {
      const response = await chai.request(server)
        .post('/api/users/login')
        .send({
          email: '',
          password: 'testPassword'
        });

      expect(response.status).to.equal(400);
      expect(response.text).to.be.a('string');

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.a.property('email');
      expect(data.email).to.equal('Email is required');
    });
  });

  context('with invalid email', function () {
    it('should return a JSON string with invalid email error', async function () {
      const response = await chai.request(server)
        .post('/api/users/login')
        .send({
          email: 'invalidEmail',
          password: 'testPassword'
        });

      expect(response.status).to.equal(400);
      expect(response.text).to.be.a('string');

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.a.property('email');
      expect(data.email).to.equal('Email is invalid');
    });
  });

  context('input email does not exist', function () {
    it('should return a JSON string with an email not found error', async function () {
      const response = await chai.request(server)
        .post('/api/users/login')
        .send({
          email: 'doesNot@exist.com',
          password: 'testPassword'
        });

      expect(response.status).to.equal(404);
      expect(response.text).to.be.a('string');

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.a.property('email');
      expect(data.email).to.equal('Email not found');
    });
  });

  context('missing password input', function () {
    it('should return a JSON string with missing password error', async function () {
      const response = await chai.request(server)
        .post('/api/users/login')
        .send({
          email: 'test@test.com',
          password: ''
        });

      expect(response.status).to.equal(400);
      expect(response.text).to.be.a('string');

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.a.property('password');
      expect(data.password).to.equal('Password is required');
    });
  });

  context('incorrect password', function () {
    it('should return a JSON string with incorrect password error', async function () {
      const response = await chai.request(server)
        .post('/api/users/login')
        .send({
          email: 'test@test.com',
          password: 'wrongPassword'
        });

      expect(response.status).to.equal(400);
      expect(response.text).to.be.a('string');

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.a.property('password');
      expect(data.password).to.equal('Password is incorrect');
    });
  });

  after('delete created user', async function() {
    const testUser = await User.findOneAndDelete({ email: 'test@test.com' });

    expect(testUser.name).to.equal('Test User');
  });
});