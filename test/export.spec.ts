import { expect } from 'chai';
import MixpanelClient from '../lib';

describe('export', function () {
  const client = new MixpanelClient({
    apiSecret: process.env.API_SECRET ?? '',
  });

  const options = {
    from_date: '2023-01-01',
    to_date: '2023-01-02',
    limit: 10,
  };

  it('should return export data', async function () {
    this.timeout(10000);
    const data = await client.export(options);
    expect(data).to.be.an('array');
    expect(data[0]).to.have.a.property('event');
  });
});
