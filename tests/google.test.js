/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { googlePass } from '../src/controllers/oauth.controller';
import app from '../src/app';

chai.use(chaiHttp);
const { expect } = chai;
describe('Google authentication', () => {
  before(() => {
    googlePass();
  });
  describe('GET /auth/google', () => {
    it('should return a redirect URL to Google', async () => {
      const res = await chai.request(app).get('/users/auth/google');
      expect(res).to.have.status(200);
      expect(res.redirects[0]).to.match(
        /^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth/
      );
    });
  });

  describe('GET /auth/google/redirect', () => {
    it('should redirect to / with a token query parameter', async () => {
      const res = await chai.request(app).get('/users/auth/google/redirect');
      expect(res).to.have.status(200);
    });

    it('should return an error when authentication fails', async () => {
      const res = await chai
        .request(app)
        .get('/users/auth/google/redirect')
        .query({ error: 'access_denied' });
      expect(res).to.have.status(404);
    });
  });

  describe('GET /redirect', () => {
    it('should return a user object and token when given a valid token', async () => {
      const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI2ZjY1OGM0LWMxNzctNDQ0OS1hOWFhLTBjMmI5Yjk4YjMzZSIsImVtYWlsIjoibmFtYmFqZWVlZHdpbkBnbWFpbC5jb20iLCJpYXQiOjE2ODA3MzEyOTAsImV4cCI6MTY4MDczNDg5MH0.VZ5t0yYPP1iCyKFQExjabb0714A_nEj_cYNQdsI3qmo';
      const res = await chai
        .request(app)
        .get(`/users/redirect?key=${userToken}`);
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Thanks for logging in');
      expect(res.body.user).to.exist;
      expect(res.body.token).to.exist;
    });

    it('should return an error when given an invalid token', async () => {
      const invalidToken = 'dyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiYjhmYjBhLWMzN2QtNDE2My1hNmJhLTIzODIzZjJmZGI4NiIsImVtYWlsIjoibmFtYmFqZWVlZHdpbkBnbWFpbC5jb20iLCJpYXQiOjE2ODAzNjMyMTksImV4cCI6MTY4MDM2NjgxOX0.UtkH8GQFDqS_pFq1O-Qmbm2EJF-fiHtOGTVvM6Iq0UU';
      const res = await chai
        .request(app)
        .get(`/users/redirect?key=${invalidToken}`);
      expect(res.body.user.error.message).to.equal('invalid token');
    });
  });
});
