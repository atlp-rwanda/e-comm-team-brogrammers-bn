import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { isUuid } from 'uuidv4';
import app from '../src/app';

// eslint-disable-next-line import/named
import db, { sequelize } from '../src/database/models/index';

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

describe('testing signup', () => {
  before(async () => {
    await db.users.destroy({ where: { email: 'edwin12@gmail.com' } });
  });
  it('should return 400 code', (done) => {
    chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'Mai DemiGod',
        password: '123@Pass',
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
  });

  it('should return 201 code', (done) => {
    chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'Mai DemiGod',
        email: 'edwin12@gmail.com',
        password: '123@Pass',
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(201);
        chai.expect(isUuid(res.body.user.id)).to.equal(true);
        done();
      });
  });

  it('should return 400 code', (done) => {
    chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'Mai DemiGod',
        email: 'edwin12@gmail.com',
        password: '123@Pass',
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
  });
});

describe('testing changing password', () => {
  it('should return 200 code and success message', (done) => {
    chai
      .request(app)
      .patch('/users/change-password')
      .send({
        email: 'john@gmail.com',
        oldPassword: '123@Pass',
        newPassword: 'NewPassword@123'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.message).to.equal('Password changed successfully');
        done();
      });
  });

  it('should return 401 code and error message', (done) => {
    chai
      .request(app)
      .patch('/users/change-password')
      .send({
        email: 'john@gmail.com',
        oldPassword: 'wrongpassword',
        newPassword: 'NewPassword@123'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('Incorrect old password');
        done();
      });
  });

  it('should return 404 code and error message for non-existent user', (done) => {
    chai
      .request(app)
      .patch('/users/change-password')
      .send({
        email: 'nonexistent@gmail.com',
        oldPassword: '123@Pass',
        newPassword: 'NewPassword@123'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(404);
        chai.expect(res.body.message).to.equal('User not found');
        done();
      });
  });
});
