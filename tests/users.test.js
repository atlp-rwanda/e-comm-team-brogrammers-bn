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
