import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
import app from '../src/app';

// eslint-disable-next-line import/named
import { sequelize } from '../src/database/models/index';

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

let userId;

describe('testing signup', () => {
  it('should return 400 code', (done) => {
    chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'Mai DemiGod',
        password: '123@Pass'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
  });

  it('should return 200 code', (done) => {
    chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'Mai DemiGod',
        email: 'mai@gmail.com',
        password: '123@Pass'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        userId = res.body.id;
        done();
      });
  });

  it('should return 400 code', (done) => {
    chai
      .request(app)
      .post('/users/signup')
      .send({
        username: 'Mai DemiGod',
        email: 'mai@gmail.com',
        password: '123@Pass'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
  });
});

describe('testing updating password', () => {
  it('should return 200 code and success message', (done) => {
    chai
      .request(app)
      .put('/users/update-password')
      .send({
        id: userId,
        currentPassword: '123@Pass',
        newPassword: 'NewPassword@123'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.message).to.equal('Password updated successfully');
        done();
      });
  });

  it('should return 400 code and error message', (done) => {
    chai
      .request(app)
      .put('/users/update-password')
      .send({
        id: userId,
        currentPassword: 'wrongpassword',
        newPassword: 'NewPassword@123'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('Current password is incorrect');
        done();
      });
  });
});

  it('should return 400 code and error message', (done) => {
    chai
      .request(app)
      .put('/users/update-password')
      .send({
        id: userId,
        currentPassword: '123@Pass',
        newPassword: 'newpassword'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        chai.expect(res.body.message).to.equal('New password does not meet requirements');
        done();
      });
  });

 
