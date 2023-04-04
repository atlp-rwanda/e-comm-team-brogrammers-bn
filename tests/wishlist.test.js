import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import path from 'path';

// eslint-disable-next-line import/no-unresolved, import/extensions
import app from '../src/app';
// eslint-disable-next-line import/named, import/no-unresolved, import/extensions
import { sequelize } from '../src/database/models/index';

const { expect } = chai;

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

describe('testing the products', () => {
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

  it('should return 500 code for missing token', (done) => {
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
        chai.expect(res.status).to.equal(500);
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

  it('should return 200 code for product updated', (done) => {
    chai
      .request(app)
      .patch(`/products/${product.id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Content-Type', 'multipart/form-data')
      .field({
        price: '90',
        quantity: '20',
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('product');
        product = res.body.product;
        done();
      });
  });

  it('should return 400 code for not valid data', (done) => {
    chai
      .request(app)
      .patch(`/products/${product.id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Content-Type', 'multipart/form-data')
      .field({
        price: '-90',
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
  });

  it('should return 400 code for not valid data', (done) => {
    chai
      .request(app)
      .patch(`/products/${product.id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Content-Type', 'multipart/form-data')
      .field({
        price: '-90',
      })
      .attach('images', path.join(__dirname, images[0]))
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        product = res.body.product;
        done();
      });
  });

  it('should return 200 code', (done) => {
    chai
      .request(app)
      .get('/products/')
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  it('should return 401 code', (done) => {
    chai
      .request(app)
      .get('/products/collection')
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });

  it('should return 200 ', (done) => {
    chai
      .request(app)
      .get('/products/collection')
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  it('should add a product to the wishlist', (done) => {
    chai
      .request(app)
      .post(`/wishlist/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        // eslint-disable-next-line no-unused-expressions
        expect(res.body.message).to.equal(
          'product added to your wishlist successfully'
        );
        done();
      });
  });
  it('should add return 400 if product already in user wishlist ', (done) => {
    chai
      .request(app)
      .post(`/wishlist/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        // eslint-disable-next-line no-unused-expressions
        expect(res.body.message).to.equal('product already in wishlist');
        done();
      });
  });
  const id = '79114227-13e3-4c53-abea-a2969c67d582';
  it('should add return 400 if product id is not found', (done) => {
    chai
      .request(app)
      .post(`/wishlist/${id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        // eslint-disable-next-line no-unused-expressions
        expect(res.body.message).to.equal('product does not exist');
        done();
      });
  });
  it('should return users wishlist', (done) => {
    chai
      .request(app)
      .get('/wishlist/')
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        // eslint-disable-next-line no-unused-expressions
        done();
      });
  });
  it('should return all wishlists for all users', async () => {
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
      .get('/wishlist/all')
      .set('Authorization', `Bearer ${token}`);
    chai.expect(verifyRes).to.have.status(200);
  });
  it('should return 404 for user who is not admin', (done) => {
    chai
      .request(app)
      .get('/wishlist/all')
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        // eslint-disable-next-line no-unused-expressions
        done();
      });
  });
  it('should delete a product from  wishlist of a user', (done) => {
    chai
      .request(app)
      .delete(`/wishlist/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        // eslint-disable-next-line no-unused-expressions
        done();
      });
  });
  it('should clear the wishlist of a user', (done) => {
    chai
      .request(app)
      .patch('/wishlist/clear')
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        // eslint-disable-next-line no-unused-expressions
        done();
      });
  });
  it('should return a 400 product that does not exist in user wishlist', (done) => {
    chai
      .request(app)
      .delete(`/wishlist/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        // eslint-disable-next-line no-unused-expressions
        done();
      });
  });
});
