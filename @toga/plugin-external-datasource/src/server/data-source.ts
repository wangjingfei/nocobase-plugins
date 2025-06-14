import { MySQLConnector } from './connectors/mysql-connector';
import { PostgresConnector } from './connectors/postgres-connector';
import { RestConnector } from './connectors/rest-connector';
import { BaseConnector } from './connectors/base-connector';
import { Plugin } from '@nocobase/server';
import { QueryTypes } from 'sequelize';

export interface DataSourceConfig {
  id: string;
  name: string;
  type: string;
  config: {
    url: string;
    username?: string;
    password?: string;
    [key: string]: any;
  };
}

export class DataSource {
  protected config: DataSourceConfig;
  protected connector: BaseConnector;
  protected plugin: Plugin;

  constructor(config: DataSourceConfig, plugin: Plugin) {
    this.config = config;
    this.plugin = plugin;
    this.connector = this.createConnector();
  }

  private createConnector(): BaseConnector {
    switch (this.config.type) {
      case 'mysql':
        return new MySQLConnector(this.config.config);
      case 'postgres':
        return new PostgresConnector(this.config.config);
      case 'rest':
        return new RestConnector(this.config.config);
      case 'main':
        // 使用 Nocobase 的主数据源
        return {
          connect: async () => {
            // 主数据源已经连接，不需要额外操作
          },
          disconnect: async () => {
            // 主数据源不需要断开连接
          },
          query: async (sql: string, params?: any[]) => {
            // 使用 Nocobase 的数据库实例执行查询
            const result = await this.plugin.db.sequelize.query(sql, {
              type: QueryTypes.SELECT,
              replacements: params,
            });
            return {
              data: result,
              fields: Object.keys(result[0] || {}),
            };
          },
          test: async () => {
            try {
              await this.plugin.db.sequelize.query('SELECT 1', {
                type: QueryTypes.SELECT,
              });
              return true;
            } catch (error) {
              return false;
            }
          },
        };
      default:
        throw new Error(`不支持的数据源类型: ${this.config.type}`);
    }
  }

  async connect() {
    await this.connector.connect();
  }

  async disconnect() {
    await this.connector.disconnect();
  }

  async query(sql: string, params?: any[]) {
    return await this.connector.query(sql, params);
  }

  async test() {
    return await this.connector.test();
  }

  getConfig() {
    return this.config;
  }
} 