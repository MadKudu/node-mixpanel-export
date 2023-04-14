/// <reference types="node" />
import { Readable } from 'stream';
import { ClientOptions, EngageResult, ExportResult } from './types';
export default class MixpanelClient {
    apiSecret: string;
    eu?: boolean;
    constructor(opts: ClientOptions);
    export(parameters: Record<string, string | number>): Promise<ExportResult>;
    getExportStream(parameters: Record<string, string | number>): Promise<Readable>;
    engage(parameters: Record<string, string | number>): Promise<EngageResult>;
    get(method: string, parameters: Record<string, string | number>): Promise<any>;
    _getStream(method: string, parameters: Record<string, string | number>): Promise<Readable>;
    _get(method: string, parameters: Record<string, string | number>): Promise<unknown>;
    _parseResponse(method: string, parameters: Record<string, string | number>, result: string): any;
    _buildRequestURL(method: string, parameters?: Record<string, string | number>): string;
    _buildAPIStub(method: string): string;
    _getParameterString(parameters: Record<string, string | number>): string;
}
