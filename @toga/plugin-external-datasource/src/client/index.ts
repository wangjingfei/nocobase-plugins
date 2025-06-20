import { Plugin } from '@nocobase/client';
import { ExternalDataSourceManager } from './components/ExternalDataSourceManager';
import { MySQLConfigForm } from './components/forms/MySQLConfigForm';
import { PostgreSQLConfigForm } from './components/forms/PostgreSQLConfigForm';
import { RestAPIConfigForm } from './components/forms/RestAPIConfigForm';

export class ExternalDataSourceClientPlugin extends Plugin {
  async load() {
    // 注册外部数据源管理组件
    this.app.addComponents({
      ExternalDataSourceManager,
      MySQLConfigForm,
      PostgreSQLConfigForm,
      RestAPIConfigForm,
    });

    // 将插件添加到设置页面
    this.app.pluginSettingsManager.add('@toga/plugin-external-datasource', {
      title: '外部数据源',
      icon: 'DatabaseOutlined',
      Component: ExternalDataSourceManager,
      aclSnippet: 'pm.@toga/plugin-external-datasource.configuration',
    });

    // 注册路由，使其可以通过URL直接访问
    this.app.router.add('admin.plugins.external-datasource', {
      path: '/admin/settings/external-datasource',
      Component: ExternalDataSourceManager,
    });
  }
}

export default ExternalDataSourceClientPlugin; 