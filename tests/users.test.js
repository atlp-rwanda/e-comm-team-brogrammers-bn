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
const { expect } = chai;
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

describe('testing user profile', () => {
  // eslint-disable-next-line prefer-const
  let user = {
    email: 'john@gmail.com',
    password: '123@Pass',
  };
  let token = '';

  it('should return a JWT token when given valid credentials', (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: user.email, password: user.password })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        token = res.body.token;
        chai.expect(res.body).to.have.property('token');
        done();
      });
  });
  it('should return 200 code and the user profile', (done) => {
    chai
      .request(app)
      .get('/users/profile')
      .set({ authorization: `bearer ${token}` })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('email', user.email);
        done();
      });
  });
  it('should return 401 code for no authorization', (done) => {
    chai
      .request(app)
      .get('/users/profile')
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
  it('should return 401 code for wrong token', (done) => {
    chai
      .request(app)
      .get('/users/profile')
      .set({ authorization: `bearer ${token}n` })
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
  it('should return 401 code for no token', (done) => {
    chai
      .request(app)
      .get('/users/profile')
      .set({ authorization: 'bearer ' })
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
  it('should return 200 code for changing profile', (done) => {
    chai
      .request(app)
      .patch('/users/profile')
      .set({ authorization: `bearer ${token}` })
      .send({
        gender: 'female'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
  it('should return 400 code for changing profile to existed email', (done) => {
    chai
      .request(app)
      .patch('/users/profile')
      .set({ authorization: `bearer ${token}` })
      .send({
        gender: 'female',
        email: 'edwin12@gmail.com'
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
  });
});

const email = 'ange@gmail.com';
describe('testing creation of admin', () => {
  it('should return change the role of user to admin', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'inezapatience2@gmail.com', password: '123@Pass' });
    const { token } = res.body;
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .patch(`/users/Create-admin/${email}`)
      .set('Authorization', `Bearer ${token}`);
    chai.expect(verifyRes).to.have.status(200);
  });
});

const Invalidemail = 'ange1@gmail.com';

it('should return 404 if a user is not found', async () => {
  const res = await chai
    .request(app)
    .post('/users/login')
    .send({ email: 'inezapatience2@gmail.com', password: '123@Pass' });
  const { token } = res.body;
  expect(res).to.have.status(200);
  expect(res.body).to.have.property('token');

  const verifyRes = await chai
    .request(app)
    .patch(`/users/Create-admin/${Invalidemail}`)
    .set('Authorization', `Bearer ${token}`);
  chai.expect(verifyRes).to.have.status(404);
});
