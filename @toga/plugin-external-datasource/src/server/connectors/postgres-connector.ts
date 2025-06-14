import { Pool, PoolClient } from 'pg';
import { BaseConnector, ConnectorConfig, QueryResult } from './base-connector';

export class PostgresConnector implements BaseConnector {
  private config: ConnectorConfig;
  private pool: Pool | null = null;
  private client: PoolClient | null = null;

  constructor(config: ConnectorConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      this.pool = new Pool({
        connectionString: this.config.url,
        user: this.config.username,
        password: this.config.password,
      });
      this.client = await this.pool.connect();
    } catch (error) {
      throw new Error(`PostgreSQL 连接失败: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client.release();
      this.client = null;
    }
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async query(sql: string, params?: any[]): Promise<QueryResult> {
    if (!this.client) {
      await this.connect();
    }

    try {
      const result = await this.client.query(sql, params);
      return {
        data: result.rows,
        fields: result.fields.map(field => field.name),
      };
    } catch (error) {
      throw new Error(`PostgreSQL 查询失败: ${error.message}`);
    }
  }

  async test(): Promise<boolean> {
    try {
      await this.connect();
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    } finally {
      await this.disconnect();
    }
  }
} 