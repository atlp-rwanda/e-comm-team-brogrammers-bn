import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import app from '../src/app'; // assuming your app's entry point is in app.js
// eslint-disable-next-line import/named
import { users, notifications } from '../src/database/models';

const { expect } = chai;

env.config();
chai.use(chaiHttp);

let sampleNotification;
let authToken;
let userId;

describe('Read/Unread notifications API', () => {
  before(async () => {
    sampleNotification = await notifications.findOne({
      include: { model: users, as: 'receiver' },
    });
    const receiver = sampleNotification.receiver.dataValues;
    userId = receiver.id;

    const login = await chai
      .request(app)
      .post('/users/login')
      .send({ email: receiver.email, password: '123@Pass' });
    authToken = login.body.token;
    expect(login).to.have.status(200);
  });

  it("should return 404 when notification don't exist", async () => {
    const res = await chai
      .request(app)
      .post(`/notification/read/${faker.datatype.uuid()}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Notification not found');
  });

  it('should mark notification as READ', async () => {
    const res = await chai
      .request(app)
      .post(`/notification/read/${sampleNotification.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.isRead).to.equal(true);
  });

  it('should mark notification as UNREAD', async () => {
    const res = await chai
      .request(app)
      .post(`/notification/unread/${sampleNotification.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.isRead).to.equal(false);
  });

  it('should mark all notification as READ', async () => {
    const res = await chai
      .request(app)
      .post('/notification/read/all')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    const unreadNotifications = await notifications.findAll({
      where: { receiverId: userId, isRead: false },
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('All notifications are read');
    expect(unreadNotifications).to.be.an('array');
    expect(unreadNotifications.length).to.equal(0);
  });
});
