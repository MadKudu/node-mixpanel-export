var chai = require('chai');
var expect = chai.expect;

var MixpanelExport = require('..');

describe('export', function () {

  var panel = new MixpanelExport({ api_secret: process.env.API_SECRET });

  var options = {};

  it('works with a promise', function () {
    this.timeout(10000);
    return panel.engage(options)
        .then(function (data) {
          // console.log(data);
          expect(data).to.be.an('object');
          expect(data.page).to.equal(0);
          expect(data.results).to.be.an('array');
          expect(data.results[0]).to.have.a.property('$distinct_id');
        });
  });

  it('works with a callback', function (done) {
    this.timeout(10000);
    panel.engage(options, function (data) {
      expect(data).to.be.an('object');
      expect(data.page).to.equal(0);
      expect(data.results).to.be.an('array');
      expect(data.results[0]).to.have.a.property('$distinct_id');
      done();
    });
  });

});
