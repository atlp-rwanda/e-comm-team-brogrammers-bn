/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
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

describe('cart', () => {
  const images = [
    './test-images/image1.png',
    './test-images/image2.png',
    './test-images/image3.png',
  ];

  let sellerToken;
  let product;
  let productId;
  before(async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'jean@gmail.com', password: '123@Pass' });
    sellerToken = res.body.token;
  });

  it('should return 401 code for missing token', (done) => {
    chai
      .request(app)
      .post('/products/')
      .set('Authorization', 'Bearer ')
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
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 400 code for few images', (done) => {
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
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
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
  it('should add a product to the cart', (done) => {
    chai
      .request(app)
      .post(`/cart/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        quantities: 5
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        // eslint-disable-next-line no-unused-expressions
        expect(res.body.value.message).to.equal('added to cart successfully');
        done();
      });
  });
  const id = '79114227-13e3-4c53-abea-a2969c67d582';
  it('should add a product to the cart', (done) => {
    chai
      .request(app)
      .post(`/cart/${id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        quantities: 5
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        // eslint-disable-next-line no-unused-expressions
        expect(res.body.message).to.equal('product does not exist');
        done();
      });
  });
  it('should delete a product from cart', (done) => {
    chai
      .request(app)
      .delete(`/cart/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        // eslint-disable-next-line no-unused-expressions
        expect(res.body.value.message).to.equal('removed product from cart  successfully');
        done();
      });
  });
});
