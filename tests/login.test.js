import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import app from '../src/app'; // assuming your app's entry point is in app.js
// eslint-disable-next-line import/named
import db, { sequelize } from '../src/database/models';

const { expect } = chai;
// eslint-disable-next-line import/named

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

const testUserData = {
  username: 'user',
  email: `user${Math.random() * 1000000}@mail.com`,
  password: '123@User123',
};

let verifyEmailToken = '';

before('Clear everyting from test db before testing', async () => {
  if (process.env.NODE_ENV === 'test') {
    await db.users.destroy({
      truncate: true,
    });
  }

  const res = await chai.request(app).post('/users/signup').send(testUserData);
  expect(res).to.have.status(201);
  expect(res.body.user).to.have.a.property('id');
  expect(res.body.user).to.have.a.property('email_token');
  verifyEmailToken = res.body.user.email_token;
});

describe('POST /users/login', () => {
  it('should return an error message when email or password are incorrect', (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Incorrect email or password');
        done();
      });
  });

  it("should return an error message when the user's email is not verified", (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: testUserData.email, password: testUserData.password })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Email is not verified');
        done();
      });
  });

  it('should return a JWT token when given valid credentials', async () => {
    const verifyRes = await chai
      .request(app)
      .get(`/users/verify-email/${verifyEmailToken}`);
    chai.expect(verifyRes).to.have.status(200);

    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: testUserData.email, password: testUserData.password });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');
  });
});
