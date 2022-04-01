
var chai = require('chai');
var expect = chai.expect;

var MixpanelExport = require('..');

var panel = new MixpanelExport({
  api_secret: process.env.API_SECRET
});

describe('node-mixpanel-export', function(){

  it('should expose the Mixpanel API methods', function () {
    expect(panel).to.have.a.property('export');
    expect(panel).to.have.a.property('getExportStream');
    expect(panel).to.have.a.property('engage');
  });
  describe('_buildAPIStub', function () {
    it('should return mixpanel.com for non-EU integrations', function () {
      var panelNonEu = new MixpanelExport({
        api_secret: process.env.API_SECRET,
      });
      var url = panelNonEu._buildAPIStub('engage');
      expect(url).to.equal('https://mixpanel.com/api/2.0/engage/?');
    });
    it('should return eu.mixpanel.com for EU integrations', function () {
      var panelEu = new MixpanelExport({
        api_secret: process.env.API_SECRET,
        eu: true
      });
      var url = panelEu._buildAPIStub('engage');
      expect(url).to.equal('https://eu.mixpanel.com/api/2.0/engage/?');
    });
  });
});
