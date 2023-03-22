/* eslint-disable camelcase */
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import app from '../src/app';

// eslint-disable-next-line import/named
import db, { sequelize } from '../src/database/models/index';

let email_token;
env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

describe('User Controller', () => {
  before(async () => {
    await db.users.destroy({ where: { email: 'edwin12@gmail.com' } });
  });
  describe('signup', () => {
    it('should register a new user and send a verification email', async () => {
      const userData = {
        username: 'tresor2023',
        email: 'edwin12@gmail.com',
        password: 'Edwin@123',
      };

      const res = await chai
        .request(app)
        .post('/users/signup')
        .send(userData);
      email_token = res.body.user.email_token;
      chai.expect(res).to.have.status(201);
      chai.expect(res.body).to.have.property('message', 'Check your email to verify your account');
      chai.expect(res.body).to.have.property('user');
      chai.expect(res.body.user).to.have.property('email', userData.email);
      chai.expect(res.body.user).to.have.property('password');
    });
    it('should  verify an email', async () => {
      const res = await chai
        .request(app)
        .get(`/users/verify-email/${email_token}`);
      chai.expect(res).to.have.status(200);
    });
    it('should return an error if registration fails', async () => {
      const userData = {
        username: 'edwin2023',
        email: 'mbonhktresor@gmail.com',
        password: '123456',
      };

      const res = await chai
        .request(app)
        .post('/users/signup')
        .send(userData);

      chai.expect(res).to.have.status(400);
    });
  });

  describe('verifyUser', () => {
    it('should return an error if user is not found', async () => {
      const res = await chai
        .request(app)
        // eslint-disable-next-line quotes
        .get(`/users/verify-email/SOME_INVALID_TOKEN`);
      chai.expect(res).to.have.status(404);
      chai.expect(res.body).to.have.property('message', 'User not found');
    });
  });
});
