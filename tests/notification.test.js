/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import { token } from 'morgan';
import path from 'path';

import app from '../src/app';
// eslint-disable-next-line import/named
import { sequelize } from '../src/database/models/index';

// eslint-disable-next-line no-unused-vars
const { expect } = chai;

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

describe('notifcations', () => {
  const images = [
    './test-images/image1.png',
    './test-images/image2.png',
    './test-images/image3.png',
  ];

  let sellerToken;
  let product;
  let productId;
  let notid;
  let userToken;
  before(async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'jean@gmail.com', password: '123@Pass' });
    sellerToken = res.body.token;
  });
  it('should return 201 code for product created', (done) => {
    chai
      .request(app)
      .post('/products/')
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Content-Type', 'multipart/form-data')
      .field({
        name: 'shoes',
        description: 'new shoes on the market',
        price: '100',
        quantity: '30',
        category: '1',
        expdate: '03-20-2030',
      })
      .attach('images', path.join(__dirname, images[0]))
      .attach('images', path.join(__dirname, images[1]))
      .end((error, res) => {
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.have.property('product');
        product = res.body.product;
        productId = product.id;
        done();
      });
  });

  it('should return all notifications for of a user', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    // eslint-disable-next-line no-shadow
    const { token } = res.body;
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .get('/notification/')
      .set('Authorization', `Bearer ${token}`);
    userToken = token;
    notid = verifyRes.body.allNotifications.results[0].id;
    chai.expect(verifyRes).to.have.status(200);
  });
  it('should return 202 for deleting a notification', (done) => {
    chai
      .request(app)
      .delete(`/notification/${notid}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(202);
        // eslint-disable-next-line no-unused-expressions
        done();
      });
  });
  it('should clear all notifications  of a user', (done) => {
    chai
      .request(app)
      .patch('/notification/clear')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(202);
        // eslint-disable-next-line no-unused-expressions
        done();
      });
  });
});
