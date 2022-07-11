var chai = require('chai');
var expect = chai.expect;

var MixpanelExport = require('..');

describe('export', function () {

  var panel = new MixpanelExport({ api_secret: process.env.API_SECRET });

  var options = {
    from_date: '2016-03-09',
    to_date: '2016-03-09'
  };

  it('works with a promise', function () {
    this.timeout(10000);
    return panel.export(options)
      .then(function (data) {
        expect(data).to.be.an('array');
        expect(data[0]).to.have.a.property('event');
      });
  });

  it('works with a callback', function (done) {
    this.timeout(10000);
    panel.export(options, function (data) {
      expect(data).to.be.an('array');
      expect(data[0]).to.have.a.property('event');
      done();
    });
  });

});
