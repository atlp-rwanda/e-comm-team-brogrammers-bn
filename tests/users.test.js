import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isUuid } from 'uuidv4';
import app from '../src/app';

// eslint-disable-next-line import/named
import { sequelize } from '../src/database/models/index';

env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);

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
        chai.expect(isUuid(res.body.data.id)).to.equal(true);
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
