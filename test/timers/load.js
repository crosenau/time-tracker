'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');
const utility = require('../utility');

const Timer = require('../../models/Timer');

chai.use(chaiHttp);

describe('API ROUTING FOR /api/timers/load', function() {
  let token;

  before('Create new test user and get JWT', async function () {
    await utility.createTestUser();
    token = await utility.getJWT();
  });

  after('delete test user an associated timer data', async function() {
    await utility.deleteTestUser();

    const testTask = await Timer.findOneAndDelete({ taskLength: 500 });
  
    expect(testTask.taskName).to.equal('Test');
  });

  context('GET request with JWT for user that does NOT have existing timer settings', function() {
    it('should return status 404 and "No timer settings found for this user"', async function() {
      const response = await chai.request(server)
        .get('/api/timers/load')
        .set('Authorization', token);

      expect(response.status).to.equal(404);
      expect(response.text).to.equal('No timer settings found for this user');
    });
  });

  context('GET request with JWT for user that has existing timer settings', function() {
    before('Create Test Timer settings to test retrieving', async function() {
      const response = await chai.request(server)
        .post('/api/timers/save')
        .set('Authorization', token)
        .send({
          taskName: 'Test',
          taskLength: 500,
          shortBreakLength: 500,
          longBreakLength: 500,
          setLength: 4,
          goal: 12,
          alarmSound: 'https://res.cloudinary.com/carpol/video/upload/v1556684851/Pomodoro%20Clock/220763__ross-stack__kitchen-egg-timer-ring-04_amp.mp3',
          tickSound: 'https://res.cloudinary.com/carpol/video/upload/v1557891147/Pomodoro%20Clock/250920__thalamus-lab__watch.mp3'
        });
  
      expect(response.status).to.equal(200);
  
      const data = JSON.parse(response.text);
  
      expect(data).to.be.an('object');
      expect(data).to.have.a.property('taskName');
      expect(data).to.have.a.property('taskLength');
      expect(data).to.have.a.property('shortBreakLength');
      expect(data).to.have.a.property('longBreakLength');
      expect(data).to.have.a.property('setLength');
      expect(data).to.have.a.property('goal');
      expect(data).to.have.a.property('alarmSound');
      expect(data).to.have.a.property('tickSound');
    });

    it('should return an object with the correct timer data', async function() {
      const response = await chai.request(server)
        .get('/api/timers/load')
        .set('Authorization', token);

      expect(response.status).to.equal(200);
      expect(response.text).to.be.a('string');

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(Object.keys(data)).to.have.lengthOf(8);
      expect(data).to.have.a.property('taskName');
      expect(data.taskName).to.be.a('string');
      expect(data.taskName).to.equal('Test');

      expect(data).to.have.a.property('taskLength');
      expect(data.taskLength).to.be.a('number');
      expect(data.taskLength).to.equal(500);

      expect(data).to.have.a.property('shortBreakLength');
      expect(data.shortBreakLength).to.be.a('number');
      expect(data.shortBreakLength).to.equal(500);

      expect(data).to.have.a.property('longBreakLength');
      expect(data.longBreakLength).to.be.a('number');
      expect(data.longBreakLength).to.equal(500);

      expect(data).to.have.a.property('setLength');
      expect(data.setLength).to.be.a('number');
      expect(data.setLength).to.equal(4);

      expect(data).to.have.a.property('goal');
      expect(data.goal).to.be.a('number');
      expect(data.goal).to.equal(12);

      expect(data).to.have.a.property('alarmSound');
      expect(data.alarmSound).to.be.a('string');
      expect(data.alarmSound).to.equal('https://res.cloudinary.com/carpol/video/upload/v1556684851/Pomodoro%20Clock/220763__ross-stack__kitchen-egg-timer-ring-04_amp.mp3');

      expect(data).to.have.a.property('tickSound');
      expect(data.tickSound).to.be.a('string');
      expect(data.tickSound).to.equal('https://res.cloudinary.com/carpol/video/upload/v1557891147/Pomodoro%20Clock/250920__thalamus-lab__watch.mp3');
    });
  });
  
});