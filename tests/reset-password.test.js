import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import jwt from 'jsonwebtoken';
import app from '../src/app'; // assuming your app's entry point is in app.js
// eslint-disable-next-line import/named
import { sequelize } from '../src/database/models';

const { expect } = chai;
// eslint-disable-next-line import/named

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

const testUserData = {
  username: 'user',
  email: `user${Math.floor(Math.random() * 1000000)}@mail.com`,
  password: '123@User123',
};

before('Signup a user before resetting a password', async () => {
  const signup = await chai
    .request(app)
    .post('/users/signup')
    .send(testUserData);
  expect(signup).to.have.status(201);
  expect(signup.body.user).to.have.a.property('id');
  expect(signup.body.user).to.have.a.property('email_token');
});

describe('POST /users/reset-password', () => {
  it('should fail when given non-existent email', async () => {
    const randomEmail = `user${Math.floor(Math.random() * 1000000)}@dom.com`;
    const res = await chai
      .request(app)
      .post('/users/reset-password')
      .send({ email: randomEmail, newPassword: '123@Pass' });
    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('User not found');
  });

  it('should send a user a reset password link through email', async () => {
    const res = await chai
      .request(app)
      .post('/users/reset-password')
      .send({ email: testUserData.email, newPassword: '123@Pass' });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Check your email for reset link');
  });
});

describe('POST /users/verify-reset-password/:resetToken', () => {
  it('should fail when given incorrect token', async () => {
    const incorrectToken = 'akwjanrkjdkafn';
    const res = await chai
      .request(app)
      .post(`/users/verify-reset-password/${incorrectToken}`)
      .send();
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Invalid password reset token');
  });

  it('should succeed when given a correct reset token and new password', async () => {
    const correctToken = jwt.sign(
      { email: testUserData.email, newPassword: '123@Pass' },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: '1h' }
    );
    const res = await chai
      .request(app)
      .post(`/users/verify-reset-password/${correctToken}`)
      .send();
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Password reset successful');
  });
});
