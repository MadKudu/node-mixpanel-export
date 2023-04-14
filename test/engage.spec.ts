import { expect } from 'chai';
import MixpanelClient from '../lib';

describe('engage', function () {
  const client = new MixpanelClient({
    apiSecret: process.env.API_SECRET ?? '',
  });

  const options = {};

  it('should return engage data', async function () {
    this.timeout(10000);
    const data = await client.engage(options);
    expect(data).to.be.an('object');
    expect(data.page).to.equal(0);
    expect(data.results).to.be.an('array');
    expect(data.results[0]).to.have.a.property('$distinct_id');
  });
});
