/* eslint-disable import/named */
/* eslint-disable camelcase */
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import { sequelize } from '../src/database/models/index';
import app from '../src/app';

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

describe('testing the payments', () => {
  let sellerToken;
  let products;
  let order;

  before(async () => {
    const login_res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'jean@gmail.com', password: '123@Pass' });
    sellerToken = login_res.body.token;
    const product_res = await chai
      .request(app)
      .get('/products');
    products = product_res.body.allproducts.results;
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

    const res = await chai
      .request(app)
      .post('/checkout')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        deliveryCountry: 'Rwanda',
        deliveryCity: 'Kigali',
        deliveryStreet: '607 st',
      });
    order = res.body.order;
  });

  it('will return 401 for no token', (done) => {
    chai
      .request(app)
      .post(`/payment/order/${order.id}`)
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });

  it('will return 404 for no order id place', (done) => {
    chai
      .request(app)
      .post('/payment/order/')
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((error, res) => {
        chai.expect(res).to.have.status(404);
        done();
      });
  });

  it('will return 200 for payment created', (done) => {
    chai
      .request(app)
      .post(`/payment/order/${order.id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('url');
        done();
      });
  });
});
