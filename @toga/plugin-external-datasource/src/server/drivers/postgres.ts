import { Sequelize } from 'sequelize';
import { DataSourceOptions } from '../DataSourceManager';

/**
 * 创建PostgreSQL数据库连接
 * @param options 数据源配置
 * @returns Sequelize实例
 */
export function createPostgresConnection(options: DataSourceOptions): Sequelize {
  const { host, port, username, password, database } = options;
  
  const connectionOptions = {
    host,
    port,
    dialect: 'postgres',
    dialectOptions: {
      // PostgreSQL特有配置
      ...options.options
    },
    logging: process.env.NODE_ENV === 'development',
    // 默认连接池配置
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // 其他默认配置
    define: {
      freezeTableName: true,
      timestamps: false
    }
  };

  return new Sequelize(database, username, password, connectionOptions);
} 