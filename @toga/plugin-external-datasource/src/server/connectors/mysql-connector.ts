import mysql from 'mysql2/promise';
import { BaseConnector, ConnectorConfig, QueryResult } from './base-connector';

export class MySQLConnector implements BaseConnector {
  private config: ConnectorConfig;
  private connection: mysql.Connection | null = null;

  constructor(config: ConnectorConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection({
        uri: this.config.url,
        user: this.config.username,
        password: this.config.password,
      });
    } catch (error) {
      throw new Error(`MySQL 连接失败: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  async query(sql: string, params?: any[]): Promise<QueryResult> {
    if (!this.connection) {
      await this.connect();
    }

    if (!this.connection) {
      throw new Error('MySQL 连接未建立');
    }

    try {
      const [rows, fields] = await this.connection.execute(sql, params);
      return {
        data: rows as any[],
        fields: fields.map(field => field.name),
      };
    } catch (error) {
      throw new Error(`MySQL 查询失败: ${error.message}`);
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