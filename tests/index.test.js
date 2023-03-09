import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.should();
chai.use(chaiHttp);
describe('testing the project', () => {
  it('should return hello message', (done) => {
    chai
      .request(app)
      .get('/home')
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  it('GET unsupportedlink/unsupportedsublink', (done) => {
    chai
      .request(app)
      .get('/unsupportedlink/unsupportedsublink')
      .end((error, res) => {
        chai.expect(res).to.have.status(404);
        done();
      });
  });
});
