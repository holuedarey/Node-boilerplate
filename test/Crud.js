/* eslint-disable no-undef */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import app from '../app';
import User from '../database/mongodb/models/User';
import codes from '../helpers/statusCodes';

chai.use(chaiHttp);

const aUser = {
  firstname: 'Ken',
  lastname: 'Kenn',
  email: 'kenneth.onah@iisysgroup.com',
  password: 'itexitex',
  roles: ['super'],
};

let token = '';

describe('Login a user: POST /auth/login', () => {
  before(async () => {
    const password = bcrypt.hashSync(aUser.password, 10);
    await User.create({ ...aUser, password });
  });

  after(async () => {
    await User.deleteMany({ email: aUser.email });
  });

  it('should successfully login a user', async () => {
    const response = await chai.request(app)
      .post('/api/v1/auth/login').send({
        email: aUser.email,
        password: aUser.password,
      });

    // eslint-disable-next-line prefer-destructuring
    token = response.body.data.token;

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.token).to.be.a('string');
    expect(response.body.data.user).to.be.an('object');
    expect(response.body.data.user.firstname).to.eqls(aUser.firstname);
    expect(response.body.data.user.lastname).to.eqls(aUser.lastname);
    expect(response.body.data.user._id).to.be.a('string');
  });

  it('should fail to login a user with incorrect details', async () => {
    const response = await chai.request(app)
      .post('/api/v1/auth/login').send({
        email: 'random@email.com',
        password: 'Userpassword',
      });

    expect(response.status).to.eqls(codes.unAuthorized);
    expect(response.body.status).to.eqls(codes.unAuthorized);
    expect(response.body.error).eqls('Invalid email address or password.');
  });
});

describe('Sign up a user: POST /auth/signup', () => {
  after(async () => {
    await User.deleteOne({ email: aUser.email });
  });

  it('should successfully signup a new user', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signup').send(aUser).set('authorization', token);

    expect(response.status).to.eqls(codes.created);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.created);
    expect(response.body.data.message).to.eqls('The user account has been created successfully and user notified.');
  }).timeout(5000);

  it('should fail to create a user without a name', async () => {
    const aUser2 = { ...aUser, email: 'ken@ken.com' };
    delete aUser2.firstname;
    const response = await chai.request(app).post('/api/v1/auth/signup').send(aUser2).set('authorization', token);

    expect(response.status).to.eqls(codes.badRequest);
    expect(response.body.status).to.eqls(codes.badRequest);
    expect(response.body.error).eqls('Validation errors.');
    expect(response.body.fields.firstname).eqls('Firstname is required.');
  });
});

describe('Request to reset password: POST /auth/reset', () => {
  before(async () => {
    const password = bcrypt.hashSync(aUser.password, 10);
    await User.create({ ...aUser, password });
  });

  after(async () => {
    await User.deleteOne({ email: aUser.email });
  });

  it('should successfully request reset password email', async () => {
    const response = await chai.request(app).post('/api/v1/auth/reset').send({ email: aUser.email });

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.message).to.eqls('Check your email for password reset link.');
    expect(response.body.data.email).to.eqls(aUser.email);
  }).timeout(5000);

  it('should fail to request reset password email for non-existent user', async () => {
    const response = await chai.request(app).post('/api/v1/auth/reset').send({ email: 'random@email.com' });

    expect(response.status).to.eqls(codes.badRequest);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.badRequest);
    expect(response.body.error).to.eqls('User does not exist.');
  }).timeout(5000);
});

describe('Change user password: PATCH /auth/reset', () => {
  const emailtoken = '09ihh9u92ufh888ue8u8dhh';
  before(async () => {
    const password = bcrypt.hashSync(aUser.password, 10);
    await User.create({ ...aUser, password, emailtoken });
  });

  after(async () => {
    await User.deleteOne({ email: aUser.email });
  });

  it('should successfully change user password by email token', async () => {
    const response = await chai.request(app).patch('/api/v1/auth/reset').send({
      email: aUser.email,
      token: emailtoken,
      password: 'newPassw',
    });

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.message).to.eqls('Password changed successfully.');
    expect(response.body.data.email).to.eqls(aUser.email);
  }).timeout(5000);

  it('should successfully change user password by loggedin user', async () => {
    const response = await chai.request(app).patch('/api/v1/auth/reset').send({
      email: aUser.email,
      password: 'newPassw',
    }).set('authorization', token);

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.message).to.eqls('Password changed successfully.');
    expect(response.body.data.email).to.eqls(aUser.email);
  }).timeout(5000);

  it('should fail to change password for invalid token', async () => {
    const response = await chai.request(app).patch('/api/v1/auth/reset').send({
      email: 'random@email.com',
      token: 'iuhjndijiofiuud',
      password: 'newPassd',
    });

    expect(response.status).to.eqls(codes.badRequest);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.badRequest);
    expect(response.body.error).to.eqls('Invalid link, kindly re-request for password reset.');
  }).timeout(5000);
});
