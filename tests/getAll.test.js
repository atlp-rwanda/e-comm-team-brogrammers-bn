import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import app from '../src/app'; // assuming your app's entry point is in app.js
// eslint-disable-next-line import/named

const { expect } = chai;

env.config();
chai.use(chaiHttp);

describe('testing all getAll end points', () => {
  it('should return an array of reviews', async () => {
    const res = await chai.request(app).get('/reviews?page=1&limit=2').send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.results[0]).to.have.property('id');
    expect(res.body.results[0]).to.have.property('productId');
    expect(res.body.results[0]).to.have.property('userId');
    expect(res.body.results[0]).to.have.property('feedback');
    expect(res.body.results[0]).to.have.property('rating');
  });

  it('getting all users', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    expect(res).to.have.status(200);
    const { token } = res.body;
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .get('/users/all?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role: 'seller',
      });
    chai.expect(verifyRes).to.have.status(200);
  });

  it('getting all products', async () => {
    const res = await chai.request(app).get('/products?page=1&limit=2').send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
  });
  it('getting all carts', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    expect(res).to.have.status(200);
    const { token } = res.body;
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .get('/cart/all?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role: 'seller',
      });
    chai.expect(verifyRes).to.have.status(200);
  });

  it('getting all wishlists', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    expect(res).to.have.status(200);
    const { token } = res.body;
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .get('/wishlist/all?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role: 'seller',
      });
    chai.expect(verifyRes).to.have.status(200);
  });
  it('getting all orders', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    expect(res).to.have.status(200);
    const { token } = res.body;
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .get('/checkout/orders?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role: 'seller',
      });
    chai.expect(verifyRes).to.have.status(200);
  });
  it('getting all notification of a user', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    expect(res).to.have.status(200);
    const { token } = res.body;
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .get('/notification?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role: 'seller',
      });
    chai.expect(verifyRes).to.have.status(200);
  });
  it('getting all logs of a user', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'mary@gmail.com', password: '123@Pass' });
    expect(res).to.have.status(200);
    const { token } = res.body;
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .get('/logs/all?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);
    chai.expect(verifyRes).to.have.status(200);
  });
  it('getting all logs by an admin', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    expect(res).to.have.status(200);
    const { token } = res.body;
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .get('/users/logs/all?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);
    chai.expect(verifyRes).to.have.status(200);
  });
});
