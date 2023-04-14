# node-mixpanel-export

A lightweight node.js wrapper around [Mixpanel's data export API](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js).

Simply instantiate the class with your API Key and API Secret and then make calls to api methods and get correctly formatted data back via a promise, callback or stream.

## Installation

```javascript
import { MixpanelClient } from 'node-mixpanel-export';
```

## Usage Instructions

```javascript
const client = new MixpanelClient({
  apiSecret: "my_api_secret"
});

const export = await client.export({
  from_date: "2014-02-28",
  to_date: "2014-03-10",
});
```

### Supported methods
 - `export(parameters)`
 - `engage(parameters)`

## Running tests

Set your Mixpanel API_SECRET as an environment variable

```shell
API_SECRET=XXX npm test
```

## Acknowledgements

This package is mostly work from Mike Carter on [mixpanel-data-export-js](https://github.com/michaelcarter/mixpanel-data-export-js).
This version is focused on node.js only and getting somewhat bigger amounts of data.
