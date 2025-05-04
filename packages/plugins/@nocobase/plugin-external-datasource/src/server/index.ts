import { Plugin } from '@nocobase/server';
import { DataSourceManager } from './DataSourceManager';
import { DatasourceController } from './controllers/DatasourceController';
import { registerDataSourceActions } from './actions';

export class PluginExternalDatasourceServer extends Plugin {
  dataSourceManager: DataSourceManager;

  async load() {
    this.app.on('afterInstall', async () => {
      // 插件安装后的处理逻辑
    });

    // 初始化数据源管理器
    this.dataSourceManager = new DataSourceManager({
      app: this.app
    });

    // 注册路由
    this.app.resourcer.define({
      name: 'external-datasources',
      actions: {
        ...registerDataSourceActions(this.dataSourceManager),
      }
    });

    // 注册控制器
    this.app.resourcer.registerAction('external-datasources', 'test', {
      resource: 'external-datasources',
      handler: DatasourceController.test,
    });

    // 加载已配置的数据源
    await this.dataSourceManager.loadAllDataSources();
  }

  async install() {
    // 创建必要的表和初始数据
    const collection = this.db.collection({
      name: 'external_datasources',
      fields: [
        {
          type: 'string',
          name: 'name',
          description: '数据源名称',
          required: true,
        },
        {
          type: 'string',
          name: 'type',
          description: '数据源类型',
          required: true,
        },
        {
          type: 'string',
          name: 'host',
          description: '主机地址',
          required: true,
        },
        {
          type: 'integer',
          name: 'port',
          description: '端口',
          required: true,
        },
        {
          type: 'string',
          name: 'username',
          description: '用户名',
          required: true,
        },
        {
          type: 'password',
          name: 'password',
          description: '密码',
          required: true,
        },
        {
          type: 'string',
          name: 'database',
          description: '数据库名称',
          required: true,
        },
        {
          type: 'json',
          name: 'options',
          description: '连接选项',
        },
        {
          type: 'boolean',
          name: 'enabled',
          description: '是否启用',
          defaultValue: true,
        }
      ]
    });

    await collection.sync();
  }

  async remove() {
    // 移除插件时的清理操作
    const collection = this.db.collection('external_datasources');
    await collection.drop();
  }
}

export default PluginExternalDatasourceServer; 