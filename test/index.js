
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

});
