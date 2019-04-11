'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');
const User = require('../../models/User');
const Task = require('../../models/Task');
const utility = require('../utility');

chai.use(chaiHttp);

describe('API ROUTING FOR /api/tasks/save', function () {
  let token;

  before('Create new test user', async function () {
    await utility.createTestUser();
  });

  before('Simulate login to get JSON web token', async function() {
    token = await utility.getJWT();
  });

  after('delete created user', async function() {
    const testTasks = await Task.deleteMany({ taskLength: 500 });

    expect(testTasks).to.be.an('object');
    expect(testTasks.deletedCount).to.equal(3);

    await utility.deleteTestUser();
  });

  context('POST with array of correctly formatted tasks', function () {
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

    it('should return an array of the saved tasks', async function () {
      const response = await chai.request(server)
        .post('/api/tasks/save')
        .set('Authorization', token)
        .send(sendData);

      expect(response.status).to.equal(200);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('array');
      expect(data).to.have.lengthOf(3);

      data.forEach(task => {
        expect(task).to.be.an('object');
        expect(task).to.have.property('taskName');
        expect(task.taskName).to.be.a('string');

        const sent = sendData.filter(obj => obj.taskName === task.taskName)[0];

        expect(task.taskName).to.equal(sent.taskName);
        expect(task).to.have.property('taskLength');
        expect(task.taskLength).to.equal(sent.taskLength);
        expect(task).to.have.property('completedAt');

        const returnedDate = new Date(task.completedAt);

        expect(returnedDate.getTime()).to.equal(sent.completedAt.getTime());
      });

    });
  });

  context('POST without JSON web token', function () {
    it('should return error 401 Unauthorized', async function () {
      const response = await chai.request(server)
        .post('/api/tasks/save')
        .send([{
          taskName: 'test4',
          taskLength: 500,
          completedAt: new Date()
        }]);

      expect(response.status).to.equal(401);
      expect(response.text).to.equal('Unauthorized');
    });
  });

  context('POST with missing task', function () {
    it('should return a missing task error', async function () {
      const response = await chai.request(server)
        .post('/api/tasks/save')
        .set('Authorization', token)
        .send([{
          taskName: '',
          taskLength: 500,
          completedAt: new Date()
        }]);

      expect(response.status).to.equal(400);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.property('message');
      expect(data.message).to.equal('tasks validation failed: taskName: Path `taskName` is required.');
    });
  });

  context('POST with missing taskLength', function () {
    it('should return a missing taskLength error', async function () {
      const response = await chai.request(server)
        .post('/api/tasks/save')
        .set('Authorization', token)
        .send([{
          taskName: 'test',
          completedAt: new Date()
        }]);

      expect(response.status).to.equal(400);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.property('message');
      expect(data.message).to.equal('tasks validation failed: taskLength: Path `taskLength` is required.');
    });
  });

  context('POST with missing completedAt', function () {
    it('should return a missing completedAt error', async function () {
      const response = await chai.request(server)
        .post('/api/tasks/save')
        .set('Authorization', token)
        .send([{
          taskName: 'test1',
          taskLength: 500
        }]);

      expect(response.status).to.equal(400);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.property('message');
      expect(data.message).to.equal('tasks validation failed: completedAt: Path `completedAt` is required.');
    });
  });

  context('POST with taskLength that is below 1', function () {
    it('should return an error indicating taskLength is below 1', async function () {
      const response = await chai.request(server)
        .post('/api/tasks/save')
        .set('Authorization', token)
        .send([{
          taskName: 'test',
          taskLength: 0.5,
          completedAt: new Date()
        }]);

      expect(response.status).to.equal(400);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.property('message');
      expect(data.message).to.equal('tasks validation failed: taskLength: taskLength must be at least 1');
    });
  });

  context('POST with completedAt that is not a date object or properly formatted date string', function () {
    it('should return an error indicating an invalid date', async function () {
      const response = await chai.request(server)
        .post('/api/tasks/save')
        .set('Authorization', token)
        .send([{
          taskName: 'test',
          taskLength: 500,
          completedAt: 'wrong'
        }]);

      expect(response.status).to.equal(400);

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.property('message');
      expect(data.message).to.equal('tasks validation failed: completedAt: Cast to Date failed for value "wrong" at path "completedAt"');
    });
  });
});