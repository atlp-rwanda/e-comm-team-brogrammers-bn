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
  email: `user${Math.floor(Math.random() * 1000000)}@mail.com`,
  password: '123@User123',
};

let verifyEmailToken = '';
let authToken = '';

before('Clear everyting from test db before testing', async () => {
  const res = await chai.request(app).post('/users/signup').send(testUserData);
  expect(res).to.have.status(201);
  expect(res.body.user).to.have.a.property('id');
  expect(res.body.user).to.have.a.property('email_token');
  verifyEmailToken = res.body.user.email_token;
});

describe('POST /users/login - without MFA', () => {
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
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Email is not verified');
        done();
      });
  });

  it('should provide JWT TOKEN when given correct credentials', async () => {
    const verifyEmailRes = await chai
      .request(app)
      .get(`/users/verify-email/${verifyEmailToken}`);
    chai.expect(verifyEmailRes).to.have.status(200);

    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: testUserData.email, password: testUserData.password });
    // Save auth token for later usage
    authToken = res.body.token;
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('email');
    expect(res.body).to.have.property('token');
    expect(res.body.email).to.equal(testUserData.email);
  });
});

describe('POST /users/enable-mfa', () => {
  // const veri = await
  it('should enable muti-factor authentication', async () => {
    const res = await chai
      .request(app)
      .post('/users/enable-mfa')
      .set('Authorization', `Bearer ${authToken}`)
      .send();
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Multi-factor authentication is enabled');
  });
});

describe('POST /users/login - with MFA', () => {
  it('should return a MFA AUTH message when given valid credentials', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: testUserData.email, password: testUserData.password });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal(
      'Please check your email for authentication code'
    );
  });
});

describe('POST /users/verify-mfa', () => {
  it('should fail when given an incorrect MFA code', async () => {
    const verifyMFaRes = await chai
      .request(app)
      .post('/users/verify-mfa')
      .send({ email: testUserData.email, mfa_code: 100 });

    expect(verifyMFaRes).to.have.status(403);
    expect(verifyMFaRes.body).to.have.property('message');
  });

  it('should provide JWT TOKEN when given correct MFA code', async () => {
    const user = await db.users.findOne({
      where: { email: testUserData.email },
    });

    const verifyMFaRes = await chai
      .request(app)
      .post('/users/verify-mfa')
      .send({ email: testUserData.email, mfa_code: user.mfa_code });
    expect(verifyMFaRes).to.have.status(200);
    expect(verifyMFaRes.body).to.have.property('email');
    expect(verifyMFaRes.body).to.have.property('token');
  });

  it('should fail when given an expired MFA code', async () => {
    // eslint-disable-next-line arrow-body-style

    const user = await db.users.findOne({
      where: { email: testUserData.email },
    });
    user.mfa_timeout = new Date(Date.now() - 60 * 1000);
    await user.save();

    const verifyMFaRes = await chai
      .request(app)
      .post('/users/verify-mfa')
      .send({ email: testUserData.email, mfa_code: user.mfa_code });

    expect(verifyMFaRes).to.have.status(403);
    expect(verifyMFaRes.body).to.have.property('message');
    expect(verifyMFaRes.body.message).to.equal('Authentication code expired');
  });
});

describe('POST /users/disable-mfa', () => {
  it('should disable muti-factor authentication', async () => {
    const res = await chai
      .request(app)
      .post('/users/disable-mfa')
      .set('Authorization', `Bearer ${authToken}`)
      .send();
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal(
      'Multi-factor authentication is disabled'
    );
  });
});
