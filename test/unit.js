
var chai = require('chai');
var expect = chai.expect;

var MixpanelExport = require('..');

var panel = new MixpanelExport({
  api_secret: process.env.API_SECRET
});

describe('_buildRequestURL', function () {

  it('should return a base mixpanel url without parameters', function () {
    var url = panel._buildRequestURL('export');
    expect(url).to.equal('https://data.mixpanel.com/api/2.0/export/?');
  });

  it('should return a mixpanel url with parameters', function () {

    var options = {
      from_date: '2016-03-09',
      to_date: '2016-03-09'
    }

    var url = panel._buildRequestURL('export', options);
    expect(url).to.equal('https://data.mixpanel.com/api/2.0/export/?from_date=2016-03-09&to_date=2016-03-09');
  });

});
