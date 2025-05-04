import { Application } from '@nocobase/server';
import { Sequelize, Options } from 'sequelize';
import { createMySQLConnection } from './drivers/mysql';
import { createPostgresConnection } from './drivers/postgres';

export interface DataSourceOptions {
  id: number;
  name: string;
  type: 'mysql' | 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  options?: any;
  enabled: boolean;
}

export interface DataSourceManagerOptions {
  app: Application;
}

export class DataSourceManager {
  app: Application;
  connections: Map<number, Sequelize> = new Map();

  constructor(options: DataSourceManagerOptions) {
    this.app = options.app;
  }

  /**
   * 创建数据源连接
   * @param options 数据源配置选项
   * @returns Sequelize实例
   */
  async createConnection(options: DataSourceOptions): Promise<Sequelize> {
    const { type, id } = options;

    // 检查是否已存在连接
    if (this.connections.has(id)) {
      return this.connections.get(id);
    }

    let connection: Sequelize;

    try {
      switch (type) {
        case 'mysql':
          connection = createMySQLConnection(options);
          break;
        case 'postgres':
          connection = createPostgresConnection(options);
          break;
        default:
          throw new Error(`Unsupported database type: ${type}`);
      }

      // 测试连接
      await connection.authenticate();
      
      // 保存连接实例
      this.connections.set(id, connection);
      
      return connection;
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error.message}`);
    }
  }

  /**
   * 关闭数据源连接
   * @param id 数据源ID
   */
  async closeConnection(id: number): Promise<void> {
    const connection = this.connections.get(id);
    if (connection) {
      await connection.close();
      this.connections.delete(id);
    }
  }

  /**
   * 获取数据源连接
   * @param id 数据源ID
   * @returns Sequelize实例
   */
  getConnection(id: number): Sequelize | undefined {
    return this.connections.get(id);
  }

  /**
   * 加载所有已配置的数据源
   */
  async loadAllDataSources(): Promise<void> {
    try {
      const repo = this.app.db.getRepository('external_datasources');
      const dataSources = await repo.find({
        filter: {
          enabled: true
        }
      });

      for (const ds of dataSources) {
        await this.createConnection({
          id: ds.id,
          name: ds.name,
          type: ds.type,
          host: ds.host,
          port: ds.port,
          username: ds.username,
          password: ds.password,
          database: ds.database,
          options: ds.options,
          enabled: ds.enabled
        });
      }
    } catch (error) {
      this.app.logger.error('Failed to load data sources:', error);
    }
  }

  /**
   * 执行SQL查询
   * @param id 数据源ID
   * @param sql SQL查询语句
   * @param options 查询选项
   * @returns 查询结果
   */
  async executeQuery(id: number, sql: string, options: any = {}): Promise<any> {
    const connection = this.getConnection(id);
    
    if (!connection) {
      throw new Error(`Data source with id ${id} not found or not connected`);
    }
    
    try {
      const [results, metadata] = await connection.query(sql, options);
      return {
        results,
        metadata
      };
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }
} 