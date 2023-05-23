/* eslint-disable import/named */
/* eslint-disable camelcase */
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import moment from 'moment';
import { sequelize } from '../src/database/models/index';
import app from '../src/app';
import { Jwt } from '../src/helpers/jwt';

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

describe('testing the seller statistics', () => {
  let sellerToken;
  let products;
  let order;
  let payment;
  const user = { email: 'jean@gmail.com', password: '123@Pass' };

  before(async () => {
    const login_res = await chai
      .request(app)
      .post('/users/login')
      .send(user);
    sellerToken = login_res.body.token;

    const product_res = await chai
      .request(app)
      .get('/products/collection')
      .set('Authorization', `Bearer ${sellerToken}`);
    products = product_res.body.allProducts.results;
    products = products.filter((val, index) => index < 3);
    // eslint-disable-next-line no-restricted-syntax
    for (const product of products) {
      // eslint-disable-next-line no-await-in-loop
      await chai
        .request(app)
        .post(`/cart/${product.id}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          quantities: 1
        });
    }

    const checkoutRes = await chai
      .request(app)
      .post('/checkout')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        deliveryCountry: 'Rwanda',
        deliveryCity: 'Kigali',
        deliveryStreet: '607 st',
      });
    order = checkoutRes.body.order;

    const paymentRes = await chai
      .request(app)
      .post(`/payment/order/${order.id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({});
    payment = paymentRes.body.url;

    const link = payment.split('#')[0].split('/');
    const sessionId = link[link.length - 1];

    const successInfo = Jwt.generateToken({
      user,
      orderId: order.id,
      redirect: '/'
    });
    await chai
      .request(app)
      .get(`/payment/success?info=${successInfo}&session=${sessionId}`)
      .set('Authorization', `Bearer ${sellerToken}`);
  });

  it('should get status but get 401 for no token', (done) => {
    const start = moment().subtract(1, 'years').format('L');
    chai
      .request(app)
      .get(`/users/stats?start=${start}`)
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });

  it('should get status for set time', (done) => {
    const start = moment().subtract(1, 'years').format('L');
    chai
      .request(app)
      .get(`/users/stats?start=${start}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('products');
        chai.expect(res.body).to.have.property('revenue');
        done();
      });
  });

  it('should get status graph but get 401 for no token', (done) => {
    chai
      .request(app)
      .get('/users/stats/graph/year')
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });

  it('should get status graph the year', (done) => {
    chai
      .request(app)
      .get('/users/stats/graph/year')
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(Array.isArray(res.body)).to.equal(true);
        chai.expect(typeof res.body[0]).to.equal('object');
        done();
      });
  });
});
