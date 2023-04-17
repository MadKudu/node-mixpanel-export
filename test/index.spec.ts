import { expect } from 'chai';
import MixpanelClient from '../lib';

const client = new MixpanelClient({ apiSecret: process.env.API_SECRET ?? '' });

describe('node-mixpanel-export', function () {
  it('should expose the Mixpanel API methods', function () {
    expect(client).to.have.a.property('export');
    expect(client).to.have.a.property('getExportStream');
    expect(client).to.have.a.property('engage');
  });
  describe('_buildAPIStub', function () {
    it('should return mixpanel.com for engage and Anon-EU integrations', function () {
      const clientNonEu = new MixpanelClient({
        apiSecret: process.env.API_SECRET ?? '',
      });
      const url = clientNonEu._buildAPIStub('engage');
      expect(url).to.equal('https://mixpanel.com/api/2.0/engage/?');
    });
    it('should return eu.mixpanel.com for engage and EU integrations', function () {
      const clientEu = new MixpanelClient({
        apiSecret: process.env.API_SECRET ?? '',
        eu: true,
      });
      const url = clientEu._buildAPIStub('engage');
      expect(url).to.equal('https://eu.mixpanel.com/api/2.0/engage/?');
    });
    it('should return data.mixpanel.com for export and non-EU integrations', function () {
      const clientNonEu = new MixpanelClient({
        apiSecret: process.env.API_SECRET ?? '',
      });
      const url = clientNonEu._buildAPIStub('export');
      expect(url).to.equal('https://data.mixpanel.com/api/2.0/export/?');
    });
    it('should return data-eu.mixpanel.com for export and EU integrations', function () {
      const clientEu = new MixpanelClient({
        apiSecret: process.env.API_SECRET ?? '',
        eu: true,
      });
      const url = clientEu._buildAPIStub('export');
      expect(url).to.equal('https://data-eu.mixpanel.com/api/2.0/export/?');
    });
  });
});
