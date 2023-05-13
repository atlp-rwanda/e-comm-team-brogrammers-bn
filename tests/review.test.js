import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import app from '../src/app'; // assuming your app's entry point is in app.js
// eslint-disable-next-line import/named
import { products, users } from '../src/database/models';

const { expect } = chai;

env.config();
chai.use(chaiHttp);

let sampleProduct;
let sampleUser;
let reviewId;
let authToken;

describe('Reviews API', () => {
  before(async () => {
    sampleUser = await users.findOne({ where: { email: 'mary@gmail.com' } });
    const res = await chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'testuser',
        email: `user${Math.floor(Math.random() * 1000000)}@mail.com`,
        password: '123@User123',
      });

    const userId = res.body.user.id;
    sampleProduct = await products.create({
      id: faker.datatype.uuid(),
      images: [
        faker.image.imageUrl(),
        faker.image.imageUrl(),
        faker.image.imageUrl(),
      ],
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      quantity: faker.datatype.number(100),
      sellerId: userId,
      exp_date: faker.date.future(),
      available: faker.datatype.boolean(),
      price: faker.commerce.price(),
      category: 1,
    });
    const login = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'mary@gmail.com', password: '123@Pass' });
    authToken = login.body.token;
  });

  describe('POST /reviews', () => {
    it('should create a new review', async () => {
      const res = await chai
        .request(app)
        .post('/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: sampleProduct.id,
          feedback: 'Great product!',
          rating: 5,
        });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.productId).to.equal(sampleProduct.id);
      expect(res.body.userId).to.equal(sampleUser.id);
      expect(res.body.feedback).to.equal('Great product!');
      expect(res.body.rating).to.equal(5);
      reviewId = res.body.id;
    });

    it('should return 400 if rating is less than 1', async () => {
      const res = await chai
        .request(app)
        .post('/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: sampleProduct.id,
          feedback: 'Bad product!',
          rating: 0,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.contain('rating');
    });

    it('should return 400 if rating is greater than 5', async () => {
      const res = await chai
        .request(app)
        .post('/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: sampleProduct.id,
          feedback: 'Great product!',
          rating: 6,
        });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.contain('rating');
    });
  });

  describe('GET /reviews', () => {
    it('should return an array of reviews', async () => {
      const res = await chai.request(app).get('/reviews').send();
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.results[0]).to.have.property('id');
      expect(res.body.results[0]).to.have.property('productId');
      expect(res.body.results[0]).to.have.property('userId');
      expect(res.body.results[0]).to.have.property('feedback');
      expect(res.body.results[0]).to.have.property('rating');
    });
  });

  describe('GET /reviews/:id', () => {
    it('should return a single review', async () => {
      const res = await chai.request(app).get(`/reviews/${reviewId}`).send();

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(reviewId);
      expect(res.body.userId).to.equal(sampleUser.id);
      expect(res.body.productId).to.equal(sampleProduct.id);
      expect(res.body.feedback).to.be.a('string');
      expect(res.body.rating).to.be.a('number');
    });

    it('should return a 404 if review does not exist', async () => {
      const res = await chai
        .request(app)
        .get(`/reviews/${faker.datatype.uuid()}`)
        .send();

      expect(res).to.have.status(404);
    });
  });

  describe('PATCH /reviews/:id', () => {
    it('should update a review', async () => {
      const newFeedback = faker.lorem.paragraph();
      const newRating = faker.datatype.number({ min: 1, max: 5 });

      const res = await chai
        .request(app)
        .patch(`/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          feedback: newFeedback,
          rating: newRating,
        });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(reviewId);
      expect(res.body.userId).to.equal(sampleUser.id);
      expect(res.body.productId).to.equal(sampleProduct.id);
      expect(res.body.feedback).to.equal(newFeedback);
      expect(res.body.rating).to.equal(newRating);
    });

    it('should return a 404 if review does not exist', async () => {
      const res = await chai
        .request(app)
        .put(`/reviews/${faker.datatype.uuid()}`)
        .send({
          feedback: faker.lorem.paragraph(),
          rating: faker.datatype.number({ min: 1, max: 5 }),
        });

      expect(res).to.have.status(404);
    });
  });

  describe('GET /products/:id/reviews', () => {
    it("should get a product's reviews", async () => {
      const res = await chai
        .request(app)
        .get(`/products/${sampleProduct.id}/reviews`);
      expect(res).to.have.status(200);
    });
  });

  describe('DELETE /reviews/:id', () => {
    it('should delete a review', async () => {
      const res = await chai
        .request(app)
        .delete(`/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send();

      expect(res).to.have.status(200);
    });

    it('should return 404 if review is not found', async () => {
      const res = await chai
        .request(app)
        .delete(`/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(404);
    });
  });
});
