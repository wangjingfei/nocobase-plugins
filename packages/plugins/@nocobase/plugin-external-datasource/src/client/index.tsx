import { Plugin } from '@nocobase/client';
import { DatasourceProvider } from './DatasourceProvider';
import { DatasourceConfiguration } from './DatasourceConfiguration';
import { SQLExplorer } from './SQLExplorer';
import './locale';

export class PluginExternalDatasourceClient extends Plugin {
  async load() {
    this.app.addProvider(DatasourceProvider);

    // 添加导航菜单
    this.app.addMenuItem('admin', {
      title: '{{t("External datasources", {ns: "external-datasource"})}}',
      icon: 'DatabaseOutlined',
      name: 'external-datasources',
      path: '/admin/settings/external-datasources',
    });

    // 添加设置页面
    this.app.router.add('admin.settings.external-datasources', {
      path: '/admin/settings/external-datasources',
      Component: DatasourceConfiguration,
    });

    // 添加SQL查询页面
    this.app.router.add('admin.settings.external-datasources.sql', {
      path: '/admin/settings/external-datasources/:id/sql',
      Component: SQLExplorer,
    });
  }
}

export default PluginExternalDatasourceClient; 