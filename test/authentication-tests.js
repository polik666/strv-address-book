const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const chaiHttp = require('chai-http')

const server = require('../server')

chai.use(chaiHttp)

const emailKarl = 'karlvonbahnhof@example.com'
const pwdKarl = 'SuperSecretPassword'

describe('Registration', () => {
  it('Missing email & password', function(done) {
    chai.request(server).post('/account/register')
    .send({ })
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body.message).not.to.be.undefined
      expect(res.body.fields).not.to.be.undefined
      expect(res.body.message).to.be.equal('Missing required fields')
      expect(res.body.fields).to.contain('Email')
      expect(res.body.fields).to.contain('Password')
      done();
    });
  });

  it('Missing email', function(done) {
    chai.request(server).post('/account/register')
    .send({ password:'SecretPasswordDontTellAnyone' })
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body.message).not.to.be.undefined
      expect(res.body.fields).not.to.be.undefined
      expect(res.body.message).to.be.equal('Missing required fields')
      expect(res.body.fields).to.contain('Email')
      done();
    });
  });

  
  it('Missing password', function(done) {
    chai.request(server).post('/account/register')
    .send({ email: emailKarl})
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.body.message).not.to.be.undefined
      expect(res.body.fields).not.to.be.undefined
      expect(res.body.message).to.be.equal('Missing required fields')
      expect(res.body.fields).to.contain('Password')
      done();
    });
  });

  it('Success', function(done) {
    chai.request(server).post('/account/register')
    .send({ email: emailKarl, password: pwdKarl})
    .end(function(err, res) {
      expect(res).to.have.status(200);
      expect(res.body).not.to.be.undefined
      expect(res.body.email).to.equal(emailKarl)
      expect(res.body.accessToken).not.to.be.undefined
      expect(res.body.refreshToken).not.to.be.undefined
      done();
    });
  });

  it('Duplicate email', function(done) {
    chai.request(server).post('/account/register')
    .send({ email: emailKarl, password: pwdKarl})
    .end(function(err, res) {
      expect(res).to.have.status(400);
      expect(res.text).not.to.be.undefined
      expect(res.text).to.be.equal('User already exists')
      done();
    });
  });
})