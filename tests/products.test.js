import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import path from 'path';

import app from '../src/app';

// eslint-disable-next-line import/named
import { sequelize } from '../src/database/models/index';

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('testing the products', () => {
  const images = [
    './test-images/image1.png',
    './test-images/image2.png',
    './test-images/image3.png',
  ];
  let sellerToken;
  let product;

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
        expdate: '03-20-2030'
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
        expdate: '03-20-2030'
      })
      .attach('images', path.join(__dirname, images[0]))
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
  });

  it('should return 200 code for product created', (done) => {
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
        expdate: '03-20-2030'
      })
      .attach('images', path.join(__dirname, images[0]))
      .attach('images', path.join(__dirname, images[1]))
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('product');
        product = res.body.product;
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
        price: '-90'
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
        price: '-90'
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
});

describe('GET /buyer/:id', () => {
  let token;

  before((done) => {
    chai.request(app)
      .post('/users/login')
      .send({
        email: 'habiholivier10@gmail.com',
        password: '123@Pass',
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should return a 404 error for invalid product ID', (done) => {
    chai.request(app)
      .get('/products/buyer/99898')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Product not found');
        done();
      });
  });

  it('should return the product if it is found ', (done) => {
    chai.request(app)
      .get('/products/buyer/8af32522-7fe8-4316-b6ec-4b0d2f2d5549')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('product');
        done();
      });
  });
})

describe('GET /seller/:id', () => {
  let token;

  before((done) => {
    chai.request(app)
      .post('/users/login')
      .send({
        email: 'jean@gmail.com',
        password: '123@Pass',
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should return a 404 error for invalid product ID', (done) => {
    chai.request(app)
      .get('/products/seller/99898')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Product not found');
        done();
      });
  });

  it('should return the product if found in seller collection', (done) => {
    chai.request(app)
      .get('/products/seller/8af32522-7fe8-4316-b6ec-4b0d2f2d5549')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('product');
        done();
      });
  });
})
