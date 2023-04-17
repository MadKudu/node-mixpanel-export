export type ClientOptions = {
  apiSecret: string;
  eu?: boolean;
};

export type EngageResult = {
  results: {
    $distinct_id: string;
    $properties: Record<string, unknown>[];
  }[];
  page: number;
  session_id: string;
  page_size: number;
  total: number;
  status: string;
  computed_at: string;
  error: string;
};

export type ExportEventResult = {
  event: string;
  properties: Record<string, unknown>;
};

export type ExportResult = ExportEventResult[];
