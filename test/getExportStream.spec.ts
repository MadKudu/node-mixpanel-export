import { expect } from 'chai';
import MixpanelClient from '../lib';
import { Readable } from 'stream';

describe('export', function () {
  const client = new MixpanelClient({
    apiSecret: process.env.API_SECRET ?? '',
  });

  const options = {
    from_date: '2023-01-01',
    to_date: '2023-01-02',
    limit: 10,
  };

  it('should return a stream', async function () {
    const stream: Readable = await client.getExportStream(options);
    expect(stream.readable).to.equal(true);
  });

  it('should be a stream of newline JSON', async function () {
    this.timeout(10000);
    const stream: Readable = await client.getExportStream(options);
    return new Promise((resolve, reject) => {
      stream
        .on('data', function (data) {
          const string = data.toString('utf-8');
          expect(string).to.be.a('string');
        })
        .on('end', resolve)
        .on('error', reject);
    });
  });
});
