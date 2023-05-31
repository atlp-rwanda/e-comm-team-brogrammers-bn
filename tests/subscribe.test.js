/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import app from '../src/app';
import db, { sequelize } from '../src/database/models/index';

sequelize.authenticate();
env.config();
chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let adminToken;

chai.use(chaiHttp);

describe('SubscriberController', () => {
  beforeEach(async () => {
    await db.Subscriber.destroy({ truncate: true });
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    adminToken = res.body.token;
  });

  describe('POST /subscribe', () => {
    it('should create a new subscriber', async () => {
      const res = await chai
        .request(app)
        .post('/subscriber')
        .send({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(res).to.have.status(201);
      expect(res.body.email).to.equal('test@example.com');
      expect(res.body.firstName).to.equal('John');
      expect(res.body.lastName).to.equal('Doe');
      expect(res.body.subscribed).to.be.false;
      expect(res.body.verificationToken).to.not.be.null;
    });

    it('should return an error if email is not provided', async () => {
      const res = await chai
        .request(app)
        .post('/subscriber')
        .send({
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('"email" is required');
    });

    it('should return an error if firstName is not provided', async () => {
      const res = await chai
        .request(app)
        .post('/subscriber')
        .send({
          email: 'test@example.com',
          lastName: 'Doe',
        });

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('"firstName" is required');
    });

    it('should return an error if lastName is not provided', async () => {
      const res = await chai
        .request(app)
        .post('/subscriber')
        .send({
          email: 'test@example.com',
          firstName: 'John',
        });

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('"lastName" is required');
    });
  });

  describe('GET /subscribers', () => {
    it('should return all subscribers', async () => {
      await db.Subscriber.bulkCreate([
        {
          email: 'test1@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          email: 'test2@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
        },
      ]);

      const res = await chai.request(app)
        .get('/subscriber/all')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.body.subscribers.results).to.be.an('array');
      expect(res.body.subscribers.results.length).to.equal(2);
      expect(res.body.subscribers.results[0].email).to.equal('test1@example.com');
      expect(res.body.subscribers.results[1].email).to.equal('test2@example.com');
    });

    it('should return a message if there are no subscribers', async () => {
      const res = await chai.request(app)
        .get('/subscriber/all')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('There are no subscribers');
    });
  });
  let invalidId;
  describe('DELETE /subscriber/:id', () => {
    it('should delete a subscriber', async () => {
      const subscriber = await db.Subscriber.create({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
      invalidId = subscriber.id;
      const res = await chai.request(app)
        .delete(`/subscriber/${subscriber.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res).to.have.status(200);
      const deletedSubscriber = await db.Subscriber.findByPk(subscriber.id);
      expect(deletedSubscriber).to.be.null;
    });
    it('should return an error if the subscriber does not exist', async () => {
      const res = await chai.request(app)
        .delete(`/subscriber/${invalidId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal('Subscriber not found');
    });
  });
});
