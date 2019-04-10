'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');

chai.use(chaiHttp);

describe('API ROUTING FOR /api/tasks/load', function () {
  let token;

  before('Create new test user and login to get token', async function () {
    const registerResponse = await chai.request(server)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'testPassword',
        password2: 'testPassword'
      });

    expect(registerResponse.status).to.equal(200);

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

    token = data.token;
  });

  after('delete created user', async function() {
    const testUser = await User.findOneAndDelete({ email: 'test@test.com' });

    expect(testUser.name).to.equal('Test User');
  });

  /* date range: {
    from: { year, month, day },
    to: { year, month, day }
  }
  */
 
  context('GET with no date range', function () {
    before('create sessions to check for ', function () {
      const sendData = [
        {
          taskName: 'test1',
          taskLength: 500,
          completedAt: new Date()
        },
        {
          taskName: 'test2',
          taskLength: 500,
          completedAt: new Date()
        },
        {
          taskName: 'test3',
          taskLength: 500,
          completedAt: new Date()
        }
      ];
    })

    it('should return an array of all of the users\' tasks', async function () {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .send();

      expect(response.status).to.equal(200);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(3);

      data.forEach(task => {
        console.log(1);
      });
    });
  });

  context('GET request from: 2019-1-1, to: 2019-2-1', function () {
    it('should return only the two tasks logged in that timeframe');
  });

  context('GET with to date later than the from date', function() {

  });

  context('GET with less than three inputs', function() {

  });

  context('GET with non-integer inputs', function() {

  });
});