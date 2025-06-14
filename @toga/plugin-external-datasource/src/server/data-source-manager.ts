import { Plugin } from '@nocobase/server';
import { DataSource } from './data-source';

export class DataSourceManager {
  protected plugin: Plugin;
  protected dataSources: Map<string, DataSource> = new Map();

  constructor(plugin: Plugin) {
    this.plugin = plugin;
  }

  async init() {
    // 从数据库加载已保存的数据源配置
    const dataSourceConfigs = await this.plugin.db.getRepository('dataSources').find();
    
    for (const config of dataSourceConfigs) {
      const dataSource = new DataSource(config, this.plugin);
      this.dataSources.set(config.id, dataSource);
    }
  }

  async addDataSource(config: any) {
    const dataSource = new DataSource(config, this.plugin);
    await this.plugin.db.getRepository('dataSources').create({
      values: config
    });
    this.dataSources.set(config.id, dataSource);
    return dataSource;
  }

  async removeDataSource(id: string) {
    await this.plugin.db.getRepository('dataSources').destroy({
      filter: { id }
    });
    this.dataSources.delete(id);
  }

  getDataSource(id: string) {
    return this.dataSources.get(id);
  }

  getAllDataSources() {
    return Array.from(this.dataSources.values());
  }
} 