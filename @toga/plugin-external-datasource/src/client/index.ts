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

    // 添加菜单项到设置页面
    this.app.pluginSettingsManager.add('external-datasource', {
      title: '外部数据源',
      icon: 'DatabaseOutlined',
      Component: ExternalDataSourceManager,
      aclSnippet: 'pm.external-datasource.configuration',
    });
  }
}

export default ExternalDataSourceClientPlugin; 