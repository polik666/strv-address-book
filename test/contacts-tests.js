process.env.NODE_ENV = 'test'

const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const chaiHttp = require('chai-http')
const helper = require('./test-helper')

const server = require('../server')

chai.use(chaiHttp)

const CREATE_PATH = '/contacts/create'
const EMAIL_TORTOISE = 'tortoise@example.com'
const EMAIL_TURTLE = 'turtle@example.com'
const PWD_SECRET = 'SuperSecretPassword'

describe('Contacts', () => {
  let accessToken = null
  let refreshToken = null
  before(function(done) {
      chai.request(server).post('/account/register')
      .send({ email: EMAIL_TORTOISE, password: PWD_SECRET})
      .end(function(err, res) {
        expect(res).to.have.status(200)
        accessToken = res.body.accessToken
        refreshToken = res.body.refreshToken
        done()
    })
  })

  it('Missing JWT token', function(done) {
     chai.request(server).post(CREATE_PATH)
    .send({ })
    .end(function(err, res) {
      expect(res).to.have.status(401)
      done()
    })
  })

  it('Missing last name', function(done) {
    chai.request(server).post(CREATE_PATH)
    .set({ 'Authorization': `Bearer ${accessToken}` })
    .send({ })
    .end(function(err, res) {
      expect(res).to.have.status(400)
      expect(helper.containsValidationError(res, 'LastName', 'Last name is required')).to.be.true
      done()
    })
  })

  it('Successful save', function(done) {
    createContact(done, accessToken, true)
  })

  it('Expired token, refresh then success', function(done) {
    this.timeout(20000);

    // register a new user with a JWT expiration set to 5 seconds
     process.env.JWT_EXPIRATION = '5s'
     chai.request(server).post('/account/register')
      .send({ email: EMAIL_TURTLE, password: PWD_SECRET})
      .end(function(err, res) {
        expect(res).to.have.status(200)
        accessToken = res.body.accessToken
        refreshToken = res.body.refreshToken

        setTimeout(function() {
          // try to create a contact after the token is expired
          createContact(null, accessToken, false)

          // refresh the token
          chai.request(server).post('/account/refreshtoken')
          .set({ "Authorization": `Bearer ${accessToken}` })
          .send({ refreshToken:  refreshToken })
          .end(function(err, res) {
               expect(res).to.have.status(200)
               newAccessToken = res.body.accessToken
               expect(newAccessToken).not.to.be.equal(accessToken)

               // try creating the contact
               createContact(done, newAccessToken, true)
            })
        }, 6000)
    })
  })
})

function createContact(done, accessToken, shouldBeOk) {
    const lastName = 'Doe'
    const firstName = 'John'
    const phone = '+420 777 888 999'
    const address = '123 Fake st. \n New York \n USA'

    chai.request(server).post(CREATE_PATH)
    .set({ 'Authorization': `Bearer ${accessToken}` })
    .send({ lastName: lastName, firstName: firstName, phone: phone, address: address  })
    .end(function(err, res) {
      if(shouldBeOk) {
        expect(res).to.have.status(200)
        expect(res.body.lastName).to.be.equal(lastName)
        expect(res.body.firstName).to.be.equal(firstName)
        expect(res.body.phone).to.be.equal(phone)
        expect(res.body.address).to.be.equal(address)
      }
      else {
        expect(res).to.have.status(403)
      }

      if(done)
        done()
    })
}