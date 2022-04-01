
var Q = require('q');
var request = require('request');
var debug = require('debug');
var qs = require('qs');

var MixpanelExport = (function () {

  function MixpanelExport (opts) {
    this.opts = opts || {};
    if (!(this.opts.api_secret)) {
      throw new Error('An api_secret needs to be provided');
    }
    this.api_secret = this.opts.api_secret;
    this.eu = this.opts.eu;
    this._requestNumber = 0;
  }

  MixpanelExport.prototype.export = function (parameters, callback) {
    return this.get('export', parameters, callback);
  };

  MixpanelExport.prototype.getExportStream = function (parameters) {
    return this._getStream('export', parameters);
  };

  MixpanelExport.prototype.engage = function (parameters, callback) {
    return this.get('engage', parameters, callback);
  };

  MixpanelExport.prototype.get = function (method, parameters, callback) {
    return this._get(method, parameters).then(function (data) {
      if (callback) {
        return callback(data);
      }
      return data;
    });
  };

  // PRIVATE METHODS:

  MixpanelExport.prototype._getStream = function (method, parameters) {
    var requestUrl = this._buildRequestURL(method, parameters);
    debug(requestUrl);
    return request.get(requestUrl)
      .auth(this.api_secret, '', true);
  };

  MixpanelExport.prototype._get = function (method, parameters) {
    var deferred = Q.defer();
    var self = this;
    var request = this._getStream(method, parameters);
    var body = '';
    request
      .on('data', function (data) {
        body += data;
      })
      .on('error', deferred.resolve)
      .on('end', function () {
        deferred.resolve(self._parseResponse(method, parameters, body));
      });
    return deferred.promise;
  };

  // Parses Mixpanel's strange formatting for the export endpoint.
  MixpanelExport.prototype._parseResponse = function (method, parameters, result) {
    if (parameters && parameters.format === 'csv') {
      return result;
    }

    if (typeof result === 'object') {
      return result;
    }

    if (method === 'export') {
      var step1 = result.replace(new RegExp('\n', 'g'), ',');
      var step2 = '[' + step1 + ']';
      var array = step2.replace(',]', ']');
      return JSON.parse(array);
    }

    return JSON.parse(result);
  };

  MixpanelExport.prototype._buildRequestURL = function (method, parameters) {
    parameters = parameters || {};
    return this._buildAPIStub(method) + this._getParameterString(parameters);
  };

  MixpanelExport.prototype._buildAPIStub = function (method) {
    var apiStub = (method === 'export') ? 'https://data.mixpanel.com/api/2.0/' : `https://${this.eu ? 'eu.' : ''}mixpanel.com/api/2.0/`;
    apiStub += (typeof method.join === 'function') ? method.join('/') : method;
    apiStub += '/?';

    return apiStub;
  };

  MixpanelExport.prototype._getParameterString = function (parameters) {
    return qs.stringify(parameters);
  };

  // MixpanelExport.prototype._base64Encode = function(string) {
  //   return new Buffer(string).toString('base64');
  // };

  return MixpanelExport;

})();

module.exports = MixpanelExport;
