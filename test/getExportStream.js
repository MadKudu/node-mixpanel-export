var chai = require('chai');
var expect = chai.expect;

var MixpanelExport = require('..');

describe('export', function () {

  var panel = new MixpanelExport({ api_secret: process.env.API_SECRET });

  var options = {
    from_date: '2016-03-09',
    to_date: '2016-03-09'
  };

  it('should return a stream', function () {
    var stream = panel.getExportStream(options);
    expect(stream.readable).to.equal(true);
  });

  it('should be a stream of newline JSON', function (done) {
    this.timeout(10000);
    var stream = panel.getExportStream(options);
    stream
      .on('data', function (data) {
        var string = data.toString('utf-8');
        expect(string).to.be.a('string');
      })
      .on('end', done)
      .on('error', done);
  });

});
