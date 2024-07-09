import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { Readable } from 'stream';
import { ClientOptions, EngageResult, ExportResult } from './types';

export default class MixpanelClient {
  /** Mixpanel Project Secret (legacy auth method) */
  apiSecret: string;
  /** Mixpanel Service Account username (recommended auth method) */
  accountUsername?: string;
  /** Mixpanel Service Account secret (recommended auth method) */
  accountSecret?: string;
  /** Mixpanel project ID, required if using service account auth method */
  projectId?: string;
  /** If true, uses the EU Mixpanel API endpoint */
  eu?: boolean;
  /** Optional filter for Mixpanel events using segmentation expressions syntax */
  where?: string;

  constructor(opts: ClientOptions) {
    if (opts.apiSecret) {
      this.apiSecret = opts.apiSecret;
      this.eu = opts.eu;
      this.where = opts.where;
      return;
    }
    if (opts.accountUsername && opts.accountSecret && opts.projectId) {
      this.accountUsername = opts.accountUsername;
      this.accountSecret = opts.accountSecret;
      this.projectId = opts.projectId;
      this.eu = opts.eu;
      this.where = opts.where;
      return;
    }
    throw new Error('Invalid Mixpanel client options');
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
    parameters?: Record<string, string | number>
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

  _getAuth(): AxiosRequestConfig {
    const isUsingServiceAccount = this.accountUsername && this.accountSecret;
    const hasFilter = this.where && this.where.length > 0;
    const secret = isUsingServiceAccount
      ? `${this.accountUsername}:${this.accountSecret}`
      : this.apiSecret;

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Basic ${Buffer.from(secret).toString('base64')}`,
      },
      params: {},
    };

    if (isUsingServiceAccount) config.params.project_id = this.projectId;
    if (hasFilter) config.params.where = this.where;

    return config;
  }

  async _getStream(
    method: string,
    parameters: Record<string, string | number>
  ): Promise<Readable> {
    const requestUrl = this._buildRequestURL(method, parameters);
    const auth = this._getAuth();
    const response = await axios.get(requestUrl, {
      ...auth,
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
