'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');

chai.use(chaiHttp);

describe('API ROUTING FOR /api/users', function () {
  describe('/api/users/register', function () {
    context('with all valid inputs', function () {
      it('should return JSON string containing name and email', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'test@test.com',
            password: 'testPassword',
            password2: 'testPassword'
          });
        
        expect(response.status).to.equal(200);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('name');
        expect(data.name).to.equal('Test User');
        expect(data).to.have.a.property('email');
        expect(data.email).to.equal('test@test.com');
      });
    });

    context('with existing/duplicate email', function () {
      it('should return a JSON error indicating the email already exists', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'test@test.com',
            password: 'testPassword',
            password2: 'testPassword'
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('email');
        expect(data.email).to.equal('Email already exists');
      });
    });

    context('with missing name input', function () {
      it('should return a JSON error indicating that name is a required field', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: '',
            email: 'test@test.com',
            password: 'testPassword',
            password2: 'testPassword'
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('name');
        expect(data.name).to.equal('Name is required');
      });
    });

    context('with missing email input', function () {
      it('should return a JSON error indicating that email is a required field', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: '',
            password: 'testPassword',
            password2: 'testPassword'
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('email');
        expect(data.email).to.equal('Email is required');
      });
    });

    context('with invalid email input', function () {
      it('should return a JSON error indicating that email is invalid', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'invalidEmail',
            password: 'testPassword',
            password2: 'testPassword'
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('email');
        expect(data.email).to.equal('Email is invalid');
      });
    });

    context('with missing password input', function () {
      it('should return a JSON error indicating that password is a required field', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'test@test.com',
            password: '',
            password2: 'testPassword'
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('password');
        expect(data.password).to.equal('Password is required');
      });
    });

    context('with password input that is below 6 characters', function () {
      it('should return a JSON error indicating that password is not an acceptable length', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'test@test.com',
            password: 'test',
            password2: 'test'
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('password');
        expect(data.password).to.equal('Password must be between 6 and 30 characters long');
      });
    });

    context('with password input that is above 30 characters', function () {
      it('should return a JSON error indicating that password is not an acceptable length', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'test@test.com',
            password: 'testPasswordThatIsSuperDuperDuperLong',
            password2: 'testPasswordThatIsSuperDuperDuperLong'
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('password');
        expect(data.password).to.equal('Password must be between 6 and 30 characters long');
      });
    });

    context('with blank password2 input', function () {
      it('should return a JSON error indicating that password2 is a required field', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'test@test.com',
            password: 'testPassword',
            password2: ''
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('password2');
        expect(data.password2).to.equal('Confirm Password is required');
      });
    });

    context('with password and password2 that don\'t match', function () {
      it('should return a JSON error indicating that password is a required field', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'test@test.com',
            password: 'testpassword',
            password2: 'differentPassword'
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('password2');
        expect(data.password2).to.equal('Passwords must match');
      });
    });

    context('with no input', function () {
      it('should return a JSON string with errors for missing fields', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send();

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('name');
        expect(data.name).to.equal('Name is required');
        expect(data).to.have.a.property('email');
        expect(data.email).to.equal('Email is required');
        expect(data).to.have.a.property('password');
        expect(data.password).to.equal('Password is required');
        expect(data).to.have.a.property('password2');
        expect(data.password2).to.equal('Confirm Password is required');
      });
    });

    context('with empty string inputs', function () {
      it('should return a JSON string with errors for missing fields', async function () {
        const response = await chai.request(server)
          .post('/api/users/register')
          .send({
            name: '',
            email: '',
            password: '',
            password2: ''
          });

        expect(response.status).to.equal(400);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('name');
        expect(data.name).to.equal('Name is required');
        expect(data).to.have.a.property('email');
        expect(data.email).to.equal('Email is required');
        expect(data).to.have.a.property('password');
        expect(data.password).to.equal('Password is required');
        expect(data).to.have.a.property('password2');
        expect(data.password2).to.equal('Confirm Password is required');
      });
    });
  });

  describe('/api/users/login', function () {
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
  });
});