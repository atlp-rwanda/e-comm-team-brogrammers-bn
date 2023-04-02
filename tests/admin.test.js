import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import db from '../src/database/models/index';

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('Admin Controller', () => {
  let adminToken;
  let user;

  before(async () => {
    await db.users.destroy({ where: { email: 'janedoe@gmail.com' } });
    await db.users.destroy({ where: { email: 'edwinnambaje4@gmail.com' } });
    const adminCredentials = {
      email: 'brogrammer@gmail.com',
      password: '123@Pass',
    };
    const adminLoginResponse = await chai
      .request(app)
      .post('/users/login')
      .send(adminCredentials);
    adminToken = adminLoginResponse.body.token;
  });

  describe('POST /users/createUser', () => {
    it('should create a new user', async () => {
      const newUser = {
        username: 'jane Doe',
        email: 'janedoe@gmail.com',
        password: '123@Pass',
        gender: 'female',
      };
      const res = await chai
        .request(app)
        .post('/users/createUser')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);
      user = res.body.user;
      expect(res).to.have.status(201);
      expect(res.body.user).to.have.property('id');
      expect(res.body.user.username).to.equal(newUser.username);
      expect(res.body.user.email).to.equal(newUser.email);
      expect(res.body.user.gender).to.equal(newUser.gender);
    });

    it('should return a 400 error if email is already registered', async () => {
      const newUser = {
        username: 'johnsmith',
        email: 'brogrammer@gmail.com',
        password: 'password',
        gender: 'male',
      };
      const res = await chai
        .request(app)
        .post('/users/createUser')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('Email already registered');
    });
  });
  describe('PATCH /users/admin/update/:id', () => {
    it('should update user details', async () => {
      const updatedUser = {
        email: 'edwinnambaje4@gmail.com',
        gender: 'male',
      };
      const res = await chai
        .request(app)
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedUser);
      expect(res).to.have.status(200);
      expect(res.body.data.email).to.equal(updatedUser.email);
      expect(res.body.data.gender).to.equal(updatedUser.gender);
    });
  });
  describe('DELETE /users/admin/delete/:id', () => {
    it('should delete user', async () => {
      const res = await chai
        .request(app)
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res).to.have.status(200);
    });
    it('should return a 404 error if user is not found', async () => {
      const res = await chai
        .request(app)
        .delete(`/users/admin/delete/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res).to.have.status(404);
    });
  });
  describe('GET /users/admin/all', () => {
    it('should return a list of all users', async () => {
      const res = await chai
        .request(app)
        .get('/users/all')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res).to.have.status(200);
    });
  });
});
