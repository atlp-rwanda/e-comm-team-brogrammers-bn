import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

const { expect } = chai;
chai.should();
chai.use(chaiHttp);
// eslint-disable-next-line no-unused-vars
let sellerToken;

before(async () => {
  const res = await chai
    .request(app)
    .post('/users/login')
    .send({ email: 'john@gmail.com', password: '123@Pass' });
  sellerToken = res.body.token;
});
describe('Chatting functionalities', () => {
  describe('GET /api/chat/all', () => {
    it('should return all messages', (done) => {
      chai.request(app)
        .get('/chat/all')
        .set('Authorization', `Bearer ${sellerToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Fetched  messages');
          expect(res.body.messages).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /chat', () => {
    it('should return an error if the request fails', (done) => {
      chai.request(app)
        .post('/chat/message')
        .send()
        .set('Authorization', `Bearer ${sellerToken}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('Failed to send a new message');
          done();
        });
    });
  });
});
