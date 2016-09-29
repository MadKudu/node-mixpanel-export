# node-mixpanel-export

A lightweight node.js wrapper around [Mixpanel's data export API](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js).

Simply instantiate the class with your API Key and API Secret and then make calls to api methods and get correctly formatted data back via a promise, callback or stream.

## Installation

```javascript
var MixpanelExport = require('node-mixpanel-export');
```

## Usage Instructions

```javascript
panel = new MixpanelExport({
  api_secret: "my_api_secret"
});

panel.export({
  from_date: "2014-02-28",
  to_date: "2014-03-10",
}).then(function(data) {
  console.log(data);
});
```

All methods also work with callback

```javascript
result = panel.engage({
  from_date: "2014-02-28",
  to_date: "2014-03-10",
  born_event: "Rendering items"
}, function(data) {
  console.log(data);
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
