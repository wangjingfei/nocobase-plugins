import { DataSourceManager } from './DataSourceManager';
import { DatasourceController } from './controllers/DatasourceController';

/**
 * 注册数据源相关Actions
 * @param dataSourceManager 数据源管理器实例
 * @returns Action配置对象
 */
export function registerDataSourceActions(dataSourceManager: DataSourceManager) {
  return {
    test: {
      handler: DatasourceController.test,
    },
    executeQuery: {
      handler: DatasourceController.executeQuery,
      params: {
        id: {
          type: 'number',
        },
      },
    },
    getTables: {
      handler: DatasourceController.getTables,
      params: {
        id: {
          type: 'number',
        },
      },
    },
    getTableStructure: {
      handler: DatasourceController.getTableStructure,
      params: {
        id: {
          type: 'number',
        },
        tableName: {
          type: 'string',
        },
      },
    },
  };
} 