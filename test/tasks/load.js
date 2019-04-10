'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');
const User = require('../../models/User');
const Task = require('../../models/Task');
const utility = require('../utility');

chai.use(chaiHttp);

describe('API ROUTING FOR /api/tasks/load', function () {
  let token;

  const testTasks = [
    {
      taskName: 'test',
      taskLength: 500,
      completedAt: new Date(2019, 0, 1)
    },
    {
      taskName: 'test1',
      taskLength: 500,
      completedAt: new Date(2019, 0, 1)
    },
    {
      taskName: 'test2',
      taskLength: 500,
      completedAt: new Date(2019, 0, 2)
    },
    {
      taskName: 'test3',
      taskLength: 500,
      completedAt: new Date(2019, 1, 15)
    }
  ];

  before('Create new test user', async function () {
    await utility.createTestUser();
  });

  before('Simulate login to get JSON web token', async function() {
    token = await utility.getJWT();
  });

  before('Create new tasks to test retrieving', async function() {
    const response = await chai.request(server)
      .post('/api/tasks/save')
      .set('Authorization', token)
      .send(testTasks);

    expect(response.status).to.equal(200);

    const data = JSON.parse(response.text);

    expect(data).to.be.an('array');
    expect(data).to.have.lengthOf(4);

    data.forEach(task => {
      expect(task).to.be.an('object');
      expect(task).to.have.property('taskName');
      expect(task.taskName).to.be.a('string');

      const sent = testTasks.filter(obj => obj.taskName === task.taskName)[0];

      expect(task.taskName).to.equal(sent.taskName);
      expect(task).to.have.property('taskLength');
      expect(task.taskLength).to.equal(sent.taskLength);
      expect(task).to.have.property('completedAt');

      const returnedDate = new Date(task.completedAt);

      expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());
    });
  });

  after('delete created user', async function() {
    const testTasks = await Task.deleteMany({ taskLength: 500 });

    expect(testTasks).to.be.an('object');
    expect(testTasks.deletedCount).to.equal(4);

    const testUser = await User.findOneAndDelete({ email: 'test@test.com' });

    expect(testUser.name).to.equal('Test User');
  });

  /* date range: {
    from: { year, month, day },
    to: { year, month, day }
  }

  ?start=01-01-2012&end=01-31-2012
  ?start=YYYYMMDD
    ?start=20180101&end=20180201
  */
 
  context('GET with no date range', function () {
    it('should return an array of all of the users\' tasks', async function () {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .send({
          start: '',
          end: ''
        });

      expect(response.status).to.equal(200);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(4);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.have.property('taskName');
        expect(task.taskName).to.be.a('string');
  
        const sent = testTasks.filter(obj => obj.taskName === task.taskName)[0];
  
        expect(task.taskName).to.equal(sent.taskName);
        expect(task).to.have.property('taskLength');
        expect(task.taskLength).to.equal(sent.taskLength);
        expect(task).to.have.property('completedAt');
  
        const returnedDate = new Date(task.completedAt);
  
        expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());  
      });
    });
  });

  context('GET request from: 2019-1-1, to: 2019-2-1', function () {
    it('should return only the three tasks logged in that timeframe', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .send({
          start: '20190101',
          end: '20190201'
        });

      expect(response.status).to.equal(200);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(3);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.have.property('taskName');
        expect(task.taskName).to.be.a('string');
  
        const sent = testTasks.filter(obj => obj.taskName === task.taskName)[0];
  
        expect(task.taskName).to.equal(sent.taskName);
        expect(task).to.have.property('taskLength');
        expect(task.taskLength).to.equal(sent.taskLength);
        expect(task).to.have.property('completedAt');
  
        const returnedDate = new Date(task.completedAt);
  
        expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());
        expect(returnedDate.getTime()).to.be.lessThan(testTasks[testTasks.length-1].getTime());
      });
    });
  });

  context('GET with only "start=20190201"', function() {
    it('should return only the tasks on or after that date', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .send({
          start: '20190201',
          end: ''
        });

      expect(request.status).to.equal(200);
      
      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(3);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.have.property('taskName');
        expect(task.taskName).to.be.a('string');
  
        const sent = testTasks.filter(obj => obj.taskName === task.taskName)[0];
  
        expect(task.taskName).to.equal(sent.taskName);
        expect(task).to.have.property('taskLength');
        expect(task.taskLength).to.equal(sent.taskLength);
        expect(task).to.have.property('completedAt');
  
        const returnedDate = new Date(task.completedAt);
  
        expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());
        expect(returnedDate.getTime()).to.be.lessThan(testTasks[testTasks.length-1].getTime());
      });
    });
  });

  context('GET with only "end=20190101"', function() {
    it('should return only the tasks on or before that date', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .send({
          start: '',
          end: '20190101'
        });

      expect(request.status).to.equal(200);
      
      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(2);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.have.property('taskName');
        expect(task.taskName).to.be.a('string');

        const sent = testTasks.filter(obj => obj.taskName === task.taskName)[0];

        expect(task.taskName).to.equal(sent.taskName);
        expect(task).to.have.property('taskLength');
        expect(task.taskLength).to.equal(sent.taskLength);
        expect(task).to.have.property('completedAt');

        const returnedDate = new Date(task.completedAt);

        expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());
        expect(returnedDate.getTime()).to.be.lessThan(testTasks[testTasks.length-2].getTime());
      });
    });
  });

  context('GET with start date later than the to date', function() {
    it('should return an invalid date range error', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .send({
          start: '20190201',
          end: '20190101'
        });

      expect(request.status).to.equal(400);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.property('message');
      expect(data.message).to.equal('Invalid date range. Start date must be before end date');
    });
  });

  context('GET with string that doens\'t follow "YYYYMMDD" format', function() {
    it('should return an invalid date error', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .send({
          start: '201921',
          end: '20190101'
        });

      expect(request.status).to.equal(400);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.property('message');
      expect(data.message).to.equal('Invalid date format. Start and end dates must be in format "YYYYMMDD"');
    });
  });
});