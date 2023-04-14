"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
class MixpanelClient {
    constructor(opts) {
        if (!opts.apiSecret) {
            throw new Error('An apiSecret needs to be provided');
        }
        this.apiSecret = opts.apiSecret;
        this.eu = opts.eu;
    }
    async export(parameters) {
        return this.get('export', parameters);
    }
    async getExportStream(parameters) {
        return this._getStream('export', parameters);
    }
    async engage(parameters) {
        return this.get('engage', parameters);
    }
    async get(method, parameters) {
        return this._get(method, parameters);
    }
    // PRIVATE METHODS:
    async _getStream(method, parameters) {
        const requestUrl = this._buildRequestURL(method, parameters);
        const response = await axios_1.default.get(requestUrl, {
            auth: {
                username: this.apiSecret,
                password: '',
            },
            responseType: 'stream',
        });
        return response.data;
    }
    async _get(method, parameters) {
        const request = await this._getStream(method, parameters);
        return new Promise((resolve, reject) => {
            let body = '';
            request
                .on('data', (data) => {
                body += data;
            })
                .on('error', reject)
                .on('end', () => {
                try {
                    const parsedResponse = this._parseResponse(method, parameters, body);
                    resolve(parsedResponse);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    // Parses Mixpanel's strange formatting for the export endpoint.
    _parseResponse(method, parameters, result) {
        if (parameters && parameters.format === 'csv') {
            return result;
        }
        if (typeof result === 'object') {
            return result;
        }
        if (method === 'export') {
            const step1 = result.replace(new RegExp('\\n', 'g'), ',');
            const step2 = '[' + step1 + ']';
            const array = step2.replace(',]', ']');
            return JSON.parse(array);
        }
        return JSON.parse(result);
    }
    _buildRequestURL(method, parameters) {
        parameters = parameters ?? {};
        return this._buildAPIStub(method) + this._getParameterString(parameters);
    }
    _buildAPIStub(method) {
        let url;
        if (method === 'export') {
            if (this.eu) {
                url = 'https://data-eu.mixpanel.com/api/2.0/';
            }
            else {
                url = 'https://data.mixpanel.com/api/2.0/';
            }
        }
        else {
            if (this.eu) {
                url = 'https://eu.mixpanel.com/api/2.0/';
            }
            else {
                url = 'https://mixpanel.com/api/2.0/';
            }
        }
        return `${url}${method}/?`;
    }
    _getParameterString(parameters) {
        return qs_1.default.stringify(parameters);
    }
}
exports.default = MixpanelClient;
//# sourceMappingURL=index.js.map