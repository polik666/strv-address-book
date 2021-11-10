process.env.NODE_ENV = 'test'

const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const chaiHttp = require('chai-http')

const server = require('../server')

chai.use(chaiHttp)

const EMAIL_DOG = 'dog@example.com'
const EMAIL_CAT = 'cat@example.com'
const EMAIL_GIRAFFE = 'giraffe@example.com'
const PWD_SECRET = 'SuperSecretPassword'

describe('Registration', () => {
  it('Missing email & password', function(done) { validateLoginParameters(done, '/account/register', undefined, undefined) })
  it('Missing email', function(done) { validateLoginParameters(done, '/account/register', undefined, PWD_SECRET) })
  it('Missing password', function(done) { validateLoginParameters(done, '/account/register', EMAIL_DOG, undefined) })

  it('Successful registration', function(done) {
    chai.request(server).post('/account/register')
    .send({ email: EMAIL_DOG, password: PWD_SECRET})
    .end(function(err, res) {
      expect(res).to.have.status(200)
      expect(res.body).not.to.be.undefined
      expect(res.body.email).to.equal(EMAIL_DOG)
      expect(res.body.accessToken).not.to.be.undefined
      expect(res.body.refreshToken).not.to.be.undefined
      done()
    })
  })

  it('Duplicate email', function(done) {
    chai.request(server).post('/account/register')
    .send({ email: EMAIL_DOG, password: PWD_SECRET})
    .end(function(err, res) {
      expect(res).to.have.status(400)
      expect(res.text).not.to.be.undefined
      expect(res.text).to.be.equal('User already exists')
      done()
    })
  })
})

describe('Login', () => {
  it('Missing email & password', function(done) { validateLoginParameters(done, '/account/login', undefined, undefined) })
  it('Missing email', function(done) { validateLoginParameters(done, '/account/login', undefined, PWD_SECRET) })
  it('Missing password', function(done) { validateLoginParameters(done, '/account/login', EMAIL_DOG, undefined) })

  it('Successful login', function(done) {
    chai.request(server).post('/account/register')
    .send({ email: EMAIL_CAT, password: PWD_SECRET})
    .end(function(err, res) {
      expect(res).to.have.status(200)

      chai.request(server).post('/account/login')
       .send({ email: EMAIL_CAT, password: PWD_SECRET})
       .end(function(err, res) {
          expect(res).to.have.status(200)
          expect(res.body).not.to.be.undefined
          expect(res.body.email).to.equal(EMAIL_CAT)
          expect(res.body.accessToken).not.to.be.undefined
          expect(res.body.refreshToken).not.to.be.undefined
          done()
       })
    })
  })
})

describe('Refresh token', () => {
  let accessToken = null
  let refreshToken = null
  before(function(done) {
      chai.request(server).post('/account/register')
      .send({ email: EMAIL_GIRAFFE, password: PWD_SECRET})
      .end(function(err, res) {
        expect(res).to.have.status(200)
        accessToken = res.body.accessToken
        refreshToken = res.body.refreshToken
        done()
    })
  })

  it('Successful refresh', function(done) {
      chai.request(server).post('/account/refreshtoken')
       .send({ refreshToken: refreshToken })
       .end(function(err, res) {
          expect(res).to.have.status(200)
          expect(res.body).not.to.be.undefined
          expect(res.body.accessToken).not.to.be.undefined
          expect(res.body.accessToken).not.to.equal(accessToken)
          done()
       })
    })

  it('Refresh token not provided', function(done) {
      chai.request(server).post('/account/refreshtoken')
       .send({ })
       .end(function(err, res) {
          expect(res).to.have.status(401)
          done()
       })
  })
})

function validateLoginParameters(done, path, email, password) {
    chai.request(server).post(path)
    .send({ })
    .end(function(err, res) {
      expect(res).to.have.status(400)
      expect(res.body.message).not.to.be.undefined
      expect(res.body.fields).not.to.be.undefined
      expect(res.body.message).to.be.equal('Missing required fields')
      if(!email)
        expect(res.body.fields).to.contain('Email')
      if(!password)
        expect(res.body.fields).to.contain('Password')
      done()
    })
}
