import axios from 'axios';
import qs from 'qs';
import { Readable } from 'stream';
import { ClientOptions, EngageResult, ExportResult } from './types';

export default class MixpanelClient {
  apiSecret: string;
  eu?: boolean;

  constructor(opts: ClientOptions) {
    if (!opts.apiSecret) {
      throw new Error('An apiSecret needs to be provided');
    }
    this.apiSecret = opts.apiSecret;
    this.eu = opts.eu;
  }

  async export(
    parameters: Record<string, string | number>
  ): Promise<ExportResult> {
    return this.get('export', parameters);
  }

  async getExportStream(
    parameters: Record<string, string | number>
  ): Promise<Readable> {
    return this._getStream('export', parameters);
  }

  async engage(
    parameters: Record<string, string | number>
  ): Promise<EngageResult> {
    return this.get('engage', parameters);
  }

  async get(
    method: string,
    parameters: Record<string, string | number>
  ): Promise<any> {
    return this._get(method, parameters);
  }

  // PRIVATE METHODS:

  async _getStream(
    method: string,
    parameters: Record<string, string | number>
  ): Promise<Readable> {
    const requestUrl = this._buildRequestURL(method, parameters);
    const response = await axios.get(requestUrl, {
      auth: {
        username: this.apiSecret,
        password: '',
      },
      responseType: 'stream',
    });
    return response.data as Readable;
  }

  async _get(method: string, parameters: Record<string, string | number>) {
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
            const parsedResponse = this._parseResponse(
              method,
              parameters,
              body
            );
            resolve(parsedResponse);
          } catch (err) {
            reject(err);
          }
        });
    });
  }

  // Parses Mixpanel's strange formatting for the export endpoint.
  _parseResponse(
    method: string,
    parameters: Record<string, string | number>,
    result: string
  ) {
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

  _buildRequestURL(
    method: string,
    parameters?: Record<string, string | number>
  ): string {
    parameters = parameters ?? {};
    return this._buildAPIStub(method) + this._getParameterString(parameters);
  }

  _buildAPIStub(method: string) {
    let url;
    if (method === 'export') {
      if (this.eu) {
        url = 'https://data-eu.mixpanel.com/api/2.0/';
      } else {
        url = 'https://data.mixpanel.com/api/2.0/';
      }
    } else {
      if (this.eu) {
        url = 'https://eu.mixpanel.com/api/2.0/';
      } else {
        url = 'https://mixpanel.com/api/2.0/';
      }
    }
    return `${url}${method}/?`;
  }

  _getParameterString(parameters: Record<string, string | number>) {
    return qs.stringify(parameters);
  }
}
