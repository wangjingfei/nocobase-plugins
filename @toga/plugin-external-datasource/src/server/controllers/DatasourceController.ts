import { Context } from '@nocobase/server';
import { DataSourceManager } from '../DataSourceManager';

export class DatasourceController {
  /**
   * 测试数据库连接
   * @param ctx Koa上下文
   */
  static async test(ctx: Context, next: () => Promise<void>) {
    const { resourcer, action, body } = ctx.request;
    const { values } = body;
    const plugin = ctx.app.getPlugin('external-datasource');
    const dataSourceManager = (plugin as any).dataSourceManager as DataSourceManager;

    try {
      // 创建临时连接进行测试
      const tempOptions = {
        id: -1, // 临时ID
        name: 'test-connection',
        ...values
      };

      const connection = await dataSourceManager.createConnection(tempOptions);
      await connection.authenticate();
      await connection.close();

      ctx.body = {
        success: true,
        message: '连接成功'
      };
    } catch (error) {
      ctx.body = {
        success: false,
        message: `连接失败: ${error.message}`
      };
    }

    await next();
  }

  /**
   * 执行SQL查询
   * @param ctx Koa上下文
   */
  static async executeQuery(ctx: Context, next: () => Promise<void>) {
    const { resourcer, action, body, query } = ctx.request;
    const { id } = ctx.params;
    const { sql, options } = body;
    
    const plugin = ctx.app.getPlugin('external-datasource');
    const dataSourceManager = (plugin as any).dataSourceManager as DataSourceManager;

    try {
      const result = await dataSourceManager.executeQuery(parseInt(id), sql, options);
      
      ctx.body = {
        success: true,
        data: result
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }

    await next();
  }

  /**
   * 获取数据库表列表
   * @param ctx Koa上下文
   */
  static async getTables(ctx: Context, next: () => Promise<void>) {
    const { id } = ctx.params;
    
    const plugin = ctx.app.getPlugin('external-datasource');
    const dataSourceManager = (plugin as any).dataSourceManager as DataSourceManager;

    try {
      const connection = dataSourceManager.getConnection(parseInt(id));
      
      if (!connection) {
        throw new Error(`数据源不存在或未连接`);
      }

      let tables = [];
      const dialect = connection.getDialect();

      // 根据不同数据库类型获取表列表
      if (dialect === 'mysql') {
        const [rows] = await connection.query('SHOW TABLES');
        tables = rows.map(row => Object.values(row)[0]);
      } else if (dialect === 'postgres') {
        const [rows] = await connection.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `);
        tables = rows.map(row => row.table_name);
      }

      ctx.body = {
        success: true,
        data: tables
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }

    await next();
  }

  /**
   * 获取表结构
   * @param ctx Koa上下文
   */
  static async getTableStructure(ctx: Context, next: () => Promise<void>) {
    const { id } = ctx.params;
    const { tableName } = ctx.query;
    
    const plugin = ctx.app.getPlugin('external-datasource');
    const dataSourceManager = (plugin as any).dataSourceManager as DataSourceManager;

    try {
      const connection = dataSourceManager.getConnection(parseInt(id));
      
      if (!connection) {
        throw new Error(`数据源不存在或未连接`);
      }

      let columns = [];
      const dialect = connection.getDialect();

      // 根据不同数据库类型获取表结构
      if (dialect === 'mysql') {
        const [rows] = await connection.query(`DESCRIBE ${tableName}`);
        columns = rows.map(row => ({
          name: row.Field,
          type: row.Type,
          nullable: row.Null === 'YES',
          key: row.Key,
          default: row.Default,
          extra: row.Extra
        }));
      } else if (dialect === 'postgres') {
        const [rows] = await connection.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = '${tableName}' AND table_schema = 'public'
        `);
        columns = rows.map(row => ({
          name: row.column_name,
          type: row.data_type,
          nullable: row.is_nullable === 'YES',
          default: row.column_default
        }));
      }

      ctx.body = {
        success: true,
        data: columns
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }

    await next();
  }
} 