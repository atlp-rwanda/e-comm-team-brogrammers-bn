/* eslint-disable camelcase */
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { isUuid } from 'uuidv4';
import path from 'path';
import app from '../src/app';

// eslint-disable-next-line import/named, import/no-duplicates
import db, { sequelize } from '../src/database/models/index';
// eslint-disable-next-line import/no-duplicates
let userID;
let adminToken;
env.config();
sequelize.authenticate();

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

let token = '';
// eslint-disable-next-line no-unused-vars
let emailToken;

describe('testing signup', () => {
  before(async () => {
    await db.users.destroy({ where: { email: 'edwin12@gmail.com' } });
  });
  // eslint-disable-next-line no-unused-vars
  let email_token;
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
        email_token = res.body.user.email_token;
        chai.expect(res).to.have.status(201);
        chai.expect(isUuid(res.body.user.id)).to.equal(true);
        userID = res.body.user.id;
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
  it('should  verify an email', async () => {
    const res = await chai
      .request(app)
      .get(`/users/verify-email/${email_token}`);
    chai.expect(res).to.have.status(200);
  });
});

describe('testing user profile', () => {
  // eslint-disable-next-line prefer-const
  let user = {
    email: 'edwin12@gmail.com',
    password: '123@Pass',
  };

  const images = {
    avatar: './test-images/avatar.jpg',
    cover: './test-images/cover.jpeg',
  };

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
  it('should return 500 code for no token', (done) => {
    chai
      .request(app)
      .get('/users/profile')
      .set({ authorization: 'bearer ' })
      .end((error, res) => {
        chai.expect(res).to.have.status(500);
        done();
      });
  });
  it('should return 200 code for changing profile', (done) => {
    chai
      .request(app)
      .patch('/users/profile')
      .set({ authorization: `bearer ${token}` })
      .send({
        gender: 'female',
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
        email: 'jean@gmail.com',
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(400);
        done();
      });
  });

  describe('testing avatar image', () => {
    it('should return 401 code for no token', (done) => {
      chai
        .request(app)
        .patch('/users/profile/avatar')
        .set('Content-Type', 'multipart/form-data')
        .attach('image', path.join(__dirname, images.avatar))
        .end((error, res) => {
          chai.expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 200 code for changing profile avatar', (done) => {
      chai
        .request(app)
        .patch('/users/profile/avatar')
        .set({ authorization: `bearer ${token}` })
        .set('Content-Type', 'multipart/form-data')
        .attach('image', path.join(__dirname, images.avatar))
        .end((error, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });

    it('should return 500 code for no profile avatar pic', (done) => {
      chai
        .request(app)
        .patch('/users/profile/avatar')
        .set({ authorization: `bearer ${token}` })
        .set('Content-Type', 'multipart/form-data')
        .attach('image')
        .end((error, res) => {
          chai.expect(res).to.have.status(500);
          done();
        });
    });

    it('should return 500 code for no profile avatar file field', (done) => {
      chai
        .request(app)
        .patch('/users/profile/avatar')
        .set({ authorization: `bearer ${token}` })
        .set('Content-Type', 'multipart/form-data')
        .end((error, res) => {
          chai.expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe('testing user cover image', () => {
    it('should return 401 code for no token', (done) => {
      chai
        .request(app)
        .patch('/users/profile/cover-image')
        .set('Content-Type', 'multipart/form-data')
        .attach('image', path.join(__dirname, images.cover))
        .end((error, res) => {
          chai.expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 200 code for changing cover image', (done) => {
      chai
        .request(app)
        .patch('/users/profile/cover-image')
        .set({ authorization: `bearer ${token}` })
        .set('Content-Type', 'multipart/form-data')
        .attach('image', path.join(__dirname, images.cover))
        .end((error, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });

    it('should return 500 code for no cover image pic', (done) => {
      chai
        .request(app)
        .patch('/users/profile/cover-image')
        .set({ authorization: `bearer ${token}` })
        .set('Content-Type', 'multipart/form-data')
        .attach('image')
        .end((error, res) => {
          chai.expect(res).to.have.status(500);
          done();
        });
    });

    it('should return 500 code for no cover image file field', (done) => {
      chai
        .request(app)
        .patch('/users/profile/cover-image')
        .set({ authorization: `bearer ${token}` })
        .set('Content-Type', 'multipart/form-data')
        .end((error, res) => {
          chai.expect(res).to.have.status(500);
          done();
        });
    });
  });
});

describe(' testing changePassword', () => {
  const user = {
    email: 'john@gmail.com',
    password: '123@Pass',
  };
  // eslint-disable-next-line no-shadow
  let token = '';

  before((done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: user.email, password: user.password })
      .end((error, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should return 401 for incorrect old password', (done) => {
    chai
      .request(app)
      .patch('/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: 'wrongpassword', newPassword: 'Newp@ssword123' })
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        chai.expect(res.body.message).to.equal('Incorrect old password');
        done();
      });
  });

  it('should return 400 for invalid new password', (done) => {
    chai
      .request(app)
      .patch('/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: user.password, newPassword: 'weakpassword' })
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        chai
          .expect(res.body.message)
          .to.equal(
            'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
          );
        done();
      });
  });

  it('should change the password successfully', (done) => {
    chai
      .request(app)
      .patch('/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: user.password, newPassword: '123@Pass' })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.message).to.equal('Password updated successfully');
        done();
      });
  });
});

const email = 'mary@gmail.com';
describe('testing creation of admin', () => {
  it('should return change the role of user to admin', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    // eslint-disable-next-line no-shadow
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

const Invalidemail = 'ange1gagaga@gmail.com';

it('should return 404 if a user is not found', async () => {
  const res = await chai
    .request(app)
    .post('/users/login')
    .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
  // eslint-disable-next-line no-shadow
  const { token } = res.body;
  expect(res).to.have.status(200);
  expect(res.body).to.have.property('token');
  adminToken = token;
  const verifyRes = await chai
    .request(app)
    .patch(`/users/create-admin/${Invalidemail}`)
    .set('Authorization', `Bearer ${token}`);
  chai.expect(verifyRes).to.have.status(404);
});

const Email = 'mary@gmail.com';
describe('testing setting role/permission to a given user', () => {
  it('should return change the role of user to a seted role', async () => {
    const res = await chai
      .request(app)
      .post('/users/login')
      .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
    // eslint-disable-next-line no-shadow
    const { token } = res.body;
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');

    const verifyRes = await chai
      .request(app)
      .patch(`/users/role/${Email}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        role: 'seller',
      });
    chai.expect(verifyRes).to.have.status(200);
  });
});

const invalidEmail = 'an@gmail.com';

it('should return 401 if a user is not found', async () => {
  const res = await chai
    .request(app)
    .post('/users/login')
    .send({ email: 'brogrammer@gmail.com', password: '123@Pass' });
  expect(res).to.have.status(200);
  expect(res.body).to.have.property('token');

  const verifyRes = await chai
    .request(app)
    .patch(`/users/role/${invalidEmail}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      role: 'seller',
    });
  chai.expect(verifyRes).to.have.status(500);
});
// disable user account

describe('should disable a user account and send an email with the disable reason', () => {
  it('should return 200 code for disabling user successfully', (done) => {
    chai
      .request(app)
      .patch(`/users/disable/${userID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        reason: 'Requests from law enforcement',
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        // eslint-disable-next-line no-undef
        done();
      });
  });

  // eslint-disable-next-line no-shadow
  it('should return 401 code for no authorization', function (done) {
    this.timeout(3000); // set timeout to 4 seconds
    chai
      .request(app)
      .patch('/users/disable/userId')
      .send({
        reason: 'Requests from law enforcement',
      })
      .end((error, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
});

describe('user should logout', () => {
  it('should return 200 code when user logs out successfully', (done) => {
    chai
      .request(app)
      .get('/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .end((error, res) => {
        chai.expect(res).to.have.status(200);
        expect(res.body.message).to.equal('You logged out successfully');
        // eslint-disable-next-line no-undef
        done();
      });
  });
  it('should return 500 code for no token', (done) => {
    chai
      .request(app)
      .get('/users/logout')
      .set({ authorization: 'bearer ' })
      .end((error, res) => {
        chai.expect(res).to.have.status(500);
        done();
      });
  });
});
