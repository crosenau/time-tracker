'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../../server');

chai.use(chaiHttp);

describe('API ROUTING FOR /api/sessions', function() {
  let token;

  before('login with previous test user to get token', async function() {
    const response = await chai.request(server)
      .post('/api/users/login')
      .send({
        email: 'test@test.com',
        password: 'testPassword'
      });

      const data = JSON.parse(response.text);

      expect(data).to.be.an('object');
      expect(data).to.have.a.property('success');
      expect(data.success).to.be.true;
      expect(data).to.have.a.property('token');
      expect(data.token).to.be.a('string');
      expect(data.token).to.match(/^Bearer/);

      token = data.token;
  });

  describe('/api/sessions/save', function() {
    context('POST with array of correctly formatted sessions', function() {
      const sendData = [
        {
          task: 'test1',
          sessionLength: 1500,
          completionDate: new Date()
        },
        {
          task: 'test2',
          sessionLength: 2000,
          completionDate: new Date()
        }
      ];

      it('should return an array of the saved sessions', async function() {
        const response = await chai.request(server)
          .post('/api/sessions/save')
          .set('Authorization', token)
          .send(sendData);

        expect(response.status).to.equal(200);

        const data = JSON.parse(response.text);

        expect(data).to.be.an('array');
        expect(data).to.have.lengthOf(2);

        data.forEach(session => {
          expect(session).to.be.an('object');
          expect(session).to.have.property('task');
          expect(session.task).to.be.a('string');

          const sent = sendData.filter(obj => obj.task === session.task)[0];

          expect(session.task).to.equal(sent.task);
          expect(session).to.have.property('sessionLength');
          expect(session.sessionLength).to.equal(sent.sessionLength);
          expect(session).to.have.property('completionDate');

          const returnedDate = new Date(session.completionDate);

          expect(returnedDate.getTime()).to.equal(sent.completionDate.getTime());
        });

      });
    });

    context('POST without JSON web token', function() {
      it('should return error 401 Unauthorized', async function() {
        const response = await chai.request(server) 
          .post('/api/sessions/save')
          .send([{
            task: 'test',
            sessionLength: 600,
            completionDate: new Date()
          }]);
        
        expect(response.status).to.equal(401);
        expect(response.text).to.equal('Unauthorized');
      });
    });

    context('POST with missing task', function() {
      it('should return a missing task error', async function() {
        const response = await chai.request(server)
          .post('/api/sessions/save')
          .set('Authorization', token)
          .send([{
            task: '',
            sessionLength: 600,
            completionDate: new Date()
          }]);

        expect(response.status).to.equal(400);

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.property('message');
        expect(data.message).to.equal('sessions validation failed: task: Path `task` is required.');
      });
    });

    context('POST with missing sessionLength', function() {
      it('should return a missing sessionLength error', async function() {
        const response = await chai.request(server)
          .post('/api/sessions/save')
          .set('Authorization', token)
          .send([{
            task: 'test',
            completionDate: new Date()
          }]);

        expect(response.status).to.equal(400);

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.property('message');
        expect(data.message).to.equal('sessions validation failed: sessionLength: Path `sessionLength` is required.');
      });
    });

    context('POST with missing completionDate', function() {
      it('should return a missing completionDate error', async function() {
        const response = await chai.request(server)
          .post('/api/sessions/save')
          .set('Authorization', token)
          .send([{
            task: 'test',
            sessionLength: 600
          }]);

        expect(response.status).to.equal(400);

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.property('message');
        expect(data.message).to.equal('sessions validation failed: completionDate: Path `completionDate` is required.');
      });
    });
    



    context('POST with sessionLength that is below 1', function() {
      it('should return an error indicating sessionLength is below 1', async function() {
        const response = await chai.request(server)
          .post('/api/sessions/save')
          .set('Authorization', token)
          .send([{
            task: 'test',
            sessionLength: 0.5,
            completionDate: new Date()
          }]);

        expect(response.status).to.equal(400);

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.property('message');
        expect(data.message).to.equal('sessions validation failed: sessionLength: sessionLength must be at least 1');
      });
    });

    context('POST with completionDate that is not a date object or properly formatted date string', function() {
      it('should return an error indicating an invalid date', async function() {
        const response = await chai.request(server)
          .post('/api/sessions/save')
          .set('Authorization', token)
          .send([{
            task: 'test',
            sessionLength: 600,
            completionDate: 'wrong'
          }]);

        expect(response.status).to.equal(400);

        const data = JSON.parse(response.text);

        expect(data).to.be.an('object');
        expect(data).to.have.property('message');
        expect(data.message).to.equal('sessions validation failed: completionDate: Cast to Date failed for value "wrong" at path "completionDate"');
      });
    });
  });

  describe('/api/sessions/load', function() {

  });
});
