export type ClientOptions = {
  /**
   * Mixpanel [Project Secret](https://developer.mixpanel.com/reference/project-secret)
   *
   * **Warning**: This authentication method is in the process of being deprecated, Mixpanel claims
   * that it will remain active for legacy customers indefinitely.
   */
  apiSecret?: string;
  /**
   * Mixpanel [Service Account](https://developer.mixpanel.com/reference/service-accounts) username
   *
   * Currently recommended authentication method. Uses the format `<serviceaccount_username>:<serviceaccount_secret>`
   */
  accountUsername?: string;
  /**
   * Mixpanel [Service Account](https://developer.mixpanel.com/reference/service-accounts) secret
   *
   * Currently recommended authentication method. Uses the format `<serviceaccount_username>:<serviceaccount_secret>`
   */
  accountSecret?: string;
  /**
   * If using Mixpanel [Service Account](https://developer.mixpanel.com/reference/service-accounts) auth method,
   * this should be set to the Mixpanel project ID usually found in the project URL: `mixpanel.com/project/<project_id>`.
   *
   * Usually looks like a number.
   */
  projectId?: string;
  /**
   * If true, uses the EU Mixpanel API endpoint
   */
  eu?: boolean;
  /**
   * Optional filter for Mixpanel events using [segmentation expressions](https://developer.mixpanel.com/reference/segmentation-expressions)
   * syntax.
   */
  where?: string;
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
