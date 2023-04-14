export type ClientOptions = {
    apiSecret: string;
    eu?: boolean;
};
export type EngageResult = {
    results: {
        $distinct_id: string;
        $properties: Record<string, any>[];
    }[];
    page: number;
    session_id: string;
    page_size: number;
    total: number;
    status: string;
    computed_at: string;
};
export type ExportEventResult = {
    event: string;
    properties: Record<string, any>;
};
export type ExportResult = ExportEventResult[];
