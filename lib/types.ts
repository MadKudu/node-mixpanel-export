export type ClientOptions = {
  /**
   * Mixpanel [Project Secret](https://developer.mixpanel.com/reference/project-secret)
   *
   * **Warning**: This authentication method is in the process of being deprecated, Mixpanel claims
   * that it will remain active for legacy customers indefinitely.
   */
  apiSecret: string;
  /**
   * Mixpanel [Service Account](https://developer.mixpanel.com/reference/service-accounts)
   *
   * Currently recommended authentication method. Uses the format `<serviceaccount_username>:<serviceaccount_secret>`
   */
  account?: string;
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
  error: string;
};

export type ExportEventResult = {
  event: string;
  properties: Record<string, any>;
};

export type ExportResult = ExportEventResult[];
