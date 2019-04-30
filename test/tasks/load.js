'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');
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
      taskName: 'test3',
      taskLength: 500,
      completedAt: new Date(2019, 1, 15)
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

  after('delete created user and tasks', async function() {
    const testTasks = await Task.deleteMany({ taskLength: 500 });

    expect(testTasks).to.be.an('object');
    expect(testTasks.deletedCount).to.equal(4);

    await utility.deleteTestUser();
  });
 
  context('GET with no date range', function () {
    it('should return an array of all of the users\' tasks in ascending order', async function () {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .query({
          start: '',
          end: ''
        });

      expect(response.status).to.equal(200);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(4);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.not.have.property('_id');
        expect(task).to.not.have.property('userId');
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

      const dates = data.map(task => new Date(task.completedAt).getTime());
      const sortedDates = dates.sort((a, b) => a - b);
      
      expect(dates.join()).to.equal(sortedDates.join());
    });
  });

  context('GET request from: 2019-1-1, to: 2019-2-1', function () {
    it('should return only the three tasks logged in that timeframe', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .query({
          start: new Date(2019, 0, 1),
          end: new Date(2019, 1, 1)
        });

      expect(response.status).to.equal(200);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(3);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.not.have.property('_id');
        expect(task).to.not.have.property('userId');
        expect(task).to.have.property('taskName');
        expect(task.taskName).to.be.a('string');
  
        const sent = testTasks.filter(obj => obj.taskName === task.taskName)[0];
  
        expect(task.taskName).to.equal(sent.taskName);
        expect(task).to.have.property('taskLength');
        expect(task.taskLength).to.equal(sent.taskLength);
        expect(task).to.have.property('completedAt');
  
        const returnedDate = new Date(task.completedAt);
  
        expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());
        expect(returnedDate.getTime()).to.be.lessThan(testTasks[1].completedAt.getTime());
      });
    });
  });

  context('GET with only start="2019-02-01T08:00:00.000Z"', function() {
    it('should return only the tasks on or after that date', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .query({
          start: new Date(2019, 1, 1),
          end: ''
        });

      expect(response.status).to.equal(200);
      
      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(1);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.not.have.property('_id');
        expect(task).to.not.have.property('userId');
        expect(task).to.have.property('taskName');
        expect(task.taskName).to.be.a('string');
  
        const sent = testTasks.filter(obj => obj.taskName === task.taskName)[0];
  
        expect(task.taskName).to.equal(sent.taskName);
        expect(task).to.have.property('taskLength');
        expect(task.taskLength).to.equal(sent.taskLength);
        expect(task).to.have.property('completedAt');
  
        const returnedDate = new Date(task.completedAt);
  
        expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());
        expect(returnedDate.getTime()).to.be.greaterThan(testTasks[testTasks.length-2].completedAt.getTime());
      });
    });
  });

  context('GET with only end="2019-02-01T08:00:00.000Z"', function() {
    it('should return only the tasks on or before that date', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .query({
          start: '',
          end: new Date(2019, 0, 1)
        });

      expect(response.status).to.equal(200);
      
      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.be.lengthOf(2);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.not.have.property('_id');
        expect(task).to.not.have.property('userId');
        expect(task).to.have.property('taskName');
        expect(task.taskName).to.be.a('string');

        const sent = testTasks.filter(obj => obj.taskName === task.taskName)[0];

        expect(task.taskName).to.equal(sent.taskName);
        expect(task).to.have.property('taskLength');
        expect(task.taskLength).to.equal(sent.taskLength);
        expect(task).to.have.property('completedAt');

        const returnedDate = new Date(task.completedAt);

        expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());
        expect(returnedDate.getTime()).to.be.lessThan(testTasks[testTasks.length-1].completedAt.getTime());
      });
    });
  });

  context('GET with string that doesn\'t follow ISO 8601 format', function() {
    it('should return an invalid date error', async function() {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .set('Authorization', token)
        .query({
          start: '201921',
          end: '20190101'
        });

      expect(response.status).to.equal(400);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.property('message');
      expect(data.message).to.equal('Cast to date failed for value "Invalid Date" at path "completedAt" for model "tasks"');
    });
  });

  context('missing JSON Web Token', function() {
    it('should return error 401 Unauthorized', async function () {
      const response = await chai.request(server)
        .get('/api/tasks/load')
        .query({
          start: '',
          end: ''
        });

        expect(response.status).to.equal(401);
        expect(response.text).to.equal('Unauthorized');
    });
  });
});