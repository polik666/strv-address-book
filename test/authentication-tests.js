const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const chaiHttp = require('chai-http')

const server = require('../server')

chai.use(chaiHttp)
// const account = require('../routes/account')

describe('/Sample', () => {
it('OK', function(done) {
   chai.request(server)
  .get('/account/echo')
  .end(function(err, res) {
    expect(res).to.have.status(200);
    done();
  });
});

})