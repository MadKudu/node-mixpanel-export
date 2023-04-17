import { expect } from 'chai';
import MixpanelClient from '../lib';

const client = new MixpanelClient({ apiSecret: process.env.API_SECRET ?? '' });

describe('_buildRequestURL', function () {
  it('should return a base mixpanel url without parameters', function () {
    const url = client._buildRequestURL('export');
    expect(url).to.equal('https://data.mixpanel.com/api/2.0/export/?');
  });

  it('should return a mixpanel url with parameters', function () {
    const options = {
      from_date: '2016-03-09',
      to_date: '2016-03-09',
    };

    const url = client._buildRequestURL('export', options);
    expect(url).to.equal(
      'https://data.mixpanel.com/api/2.0/export/?from_date=2016-03-09&to_date=2016-03-09'
    );
  });
});
