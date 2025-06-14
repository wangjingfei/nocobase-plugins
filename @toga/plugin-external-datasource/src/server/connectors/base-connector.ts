export interface ConnectorConfig {
  url: string;
  username?: string;
  password?: string;
  [key: string]: any;
}

export interface QueryResult {
  data: any[];
  total?: number;
  fields?: string[];
}

export interface BaseConnector {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query(sql: string, params?: any[]): Promise<QueryResult>;
  test(): Promise<boolean>;
} 