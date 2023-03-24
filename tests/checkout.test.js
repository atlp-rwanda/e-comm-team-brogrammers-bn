import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import app from '../src/app'; // assuming your app's entry point is in app.js
// eslint-disable-next-line import/named
import { products } from '../src/database/models';

const { expect } = chai;

env.config();
chai.use(chaiHttp);

let authToken;
let userId;

describe('testing buyer should checkout', () => {
  before(async () => {
    const userData = {
      username: 'testuser',
      email: `user${Math.floor(
        faker.datatype.number({ min: 10000000 })
      )}@mail.com`,
      password: '123@User123',
    };
    const res = await chai.request(app).post('/users/signup').send(userData);

    userId = res.body.user.id;

    await chai
      .request(app)
      .get(`/users/verify-email/${res.body.user.email_token}`);
    const login = await chai
      .request(app)
      .post('/users/login')
      .send({ email: userData.email, password: userData.password });
    authToken = login.body.token;
  });

  describe('POST /checkout', async () => {
    it('should fail when cart is empty', async () => {
      const res = await chai
        .request(app)
        .post('/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          deliveryCountry: 'Rwanda',
          deliveryCity: 'Kigali',
          deliveryStreet: '607 st',
          paymentMethod: 'Momo',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal("You cart is empty can't checkout");
    });

    it('should succeed if user has cart and provided all info', async () => {
      const sampleProduct = await products.create({
        id: faker.datatype.uuid(),
        images: [
          faker.image.imageUrl(),
          faker.image.imageUrl(),
          faker.image.imageUrl(),
        ],
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        quantity: faker.datatype.number({ min: 100 }),
        sellerId: userId,
        exp_date: faker.date.future(2),
        available: true,
        price: faker.commerce.price(),
        category: 1,
      });
      await chai
        .request(app)
        .post(`/cart/${sampleProduct.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantities: 5,
        });
      const res = await chai
        .request(app)
        .post('/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          deliveryCountry: 'Rwanda',
          deliveryCity: 'Kigali',
          deliveryStreet: '607 st',
          paymentMethod: 'Momo',
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Order was created successfully');
    });
  });
});
