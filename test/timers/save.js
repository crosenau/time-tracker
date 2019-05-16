'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');
const utility = require('../utility');
const Timer = require('../../models/Timer');

chai.use(chaiHttp);

describe('API ROUTING FOR /api/timers/save', function() {
  let token;

  before('create test user and get JWT', async function() {
    await utility.createTestUser();
    token = await utility.getJWT();
  });

  after('delete test user an associated timer data', async function() {
    await utility.deleteTestUser();

    const testTask = await Timer.findOneAndDelete({ taskLength: 500 });
  
    expect(testTask.name).to.equal('Test');
  });

  context('POST with valid timer settings object', function() {
    it('should return JSON object with supplied settings', async function() {
      const response = await chai.request(server)
        .post('/api/timers/save')
        .set('Authorization', token)
        .send({
          taskName: 'Test',
          taskLength: 500,
          shortBreakLength: 300,
          longBreakLength: 900,
          setLength: 4,
          goal: 12,
          alarmSound: 'https://res.cloudinary.com/carpol/video/upload/v1556684851/Pomodoro%20Clock/220763__ross-stack__kitchen-egg-timer-ring-04_amp.mp3',
          tickSound: 'https://res.cloudinary.com/carpol/video/upload/v1557891147/Pomodoro%20Clock/250920__thalamus-lab__watch.mp3'
        });

        expect(response.status).to.equal(200);
        expect(response.text).to.be.a('string');

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.a.property('taskName');
        expect(data.taskName).to.be.a('string');
        expect(data.taskName).to.equal('Test');

        expect(data).to.have.a.property('taskLength');
        expect(data.taskLength).to.be.a('number');
        expect(data.taskName).to.equal(1500);

        expect(data).to.have.a.property('shortBreakLength');
        expect(data.shortBreakLength).to.be.a('number');
        expect(data.shortBreakLength).to.equal(300);

        expect(data).to.have.a.property('longBreakLength');
        expect(data.longBreakLength).to.be.a('number');
        expect(data.longBreakLength).to.equal(900);

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