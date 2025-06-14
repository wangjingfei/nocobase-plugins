import axios, { AxiosInstance, AxiosError } from 'axios';
import { BaseConnector, ConnectorConfig, QueryResult } from './base-connector';

export class RestConnector implements BaseConnector {
  private config: ConnectorConfig;
  private client: AxiosInstance;

  constructor(config: ConnectorConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.url,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
      },
    });

    if (config.username && config.password) {
      this.client.defaults.auth = {
        username: config.username,
        password: config.password,
      };
    }
  }

  async connect(): Promise<void> {
    // REST API 不需要显式连接
  }

  async disconnect(): Promise<void> {
    // REST API 不需要显式断开连接
  }

  async query(sql: string, params?: any[]): Promise<QueryResult> {
    try {
      // 将 SQL 查询转换为 REST API 请求
      const [method, path] = this.parseQuery(sql);
      const response = await this.client.request({
        method,
        url: path,
        data: params?.[0] || {},
      });

      return {
        data: Array.isArray(response.data) ? response.data : [response.data],
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`REST API 请求失败: ${error.response?.status} ${error.response?.statusText || error.message}`);
      }
      throw new Error(`REST API 请求失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async test(): Promise<boolean> {
    try {
      await this.query('GET /');
      return true;
    } catch (error) {
      console.warn('REST API 连接测试失败:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  private parseQuery(sql: string): [string, string] {
    // 简单的查询解析，格式为: "METHOD /path"
    const [method, path] = sql.trim().split(' ');
    return [method.toUpperCase(), path];
  }
} 