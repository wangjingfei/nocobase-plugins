import { Plugin } from '@nocobase/server';
import { DataSourceManager } from './data-source-manager';
import { SyncManager } from './sync/sync-manager';

export class ExternalDataSourcePlugin extends Plugin {
  dataSourceManager: DataSourceManager;
  syncManager: SyncManager;

  getName(): string {
    return 'external-datasource';
  }

  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    // 定义数据源配置的 collection
    this.defineCollections();
    
    // 初始化数据源管理器
    this.dataSourceManager = new DataSourceManager(this);
    await this.dataSourceManager.init();

    // 初始化同步管理器
    this.syncManager = new SyncManager(this, this.dataSourceManager);
    await this.syncManager.init();

    // 注册 API 路由
    this.registerRoutes();
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}

  private defineCollections() {
    // 定义外部数据源配置的 collection
    this.db.collection({
      name: 'externalDataSources',
      fields: [
        {
          type: 'string',
          name: 'name',
          unique: true,
        },
        {
          type: 'string', 
          name: 'type',
        },
        {
          type: 'json',
          name: 'config',
        },
        {
          type: 'boolean',
          name: 'enabled',
          defaultValue: true,
        },
        {
          type: 'date',
          name: 'lastSyncTime',
        },
      ],
    });
  }

  private registerRoutes() {
    const plugin = this;
    
    // 数据源管理 API
    this.app.resource({
      name: 'externalDataSources',
      actions: {
        async list(ctx) {
          const dataSources = plugin.dataSourceManager.getAllDataSources();
          ctx.body = dataSources.map(ds => ds.getConfig());
        },
        async create(ctx) {
          const dataSource = await plugin.dataSourceManager.addDataSource(ctx.request.body);
          ctx.body = dataSource.getConfig();
        },
        async update(ctx) {
          const { id } = ctx.params;
          const dataSource = plugin.dataSourceManager.getDataSource(id);
          if (!dataSource) {
            ctx.throw(404, '数据源不存在');
            return;
          }
          // TODO: 实现更新逻辑
          ctx.body = dataSource.getConfig();
        },
        async destroy(ctx) {
          const { id } = ctx.params;
          await plugin.dataSourceManager.removeDataSource(id);
          ctx.body = { success: true };
        },
        async test(ctx) {
          const { id } = ctx.params;
          const dataSource = plugin.dataSourceManager.getDataSource(id);
          if (!dataSource) {
            ctx.throw(404, '数据源不存在');
            return;
          }
          const result = await dataSource.test();
          ctx.body = { success: result };
        },
      },
    });

    // 同步任务管理 API
    this.app.resource({
      name: 'syncTasks',
      actions: {
        async list(ctx) {
          const tasks = plugin.syncManager.getAllTasks();
          ctx.body = tasks;
        },
        async create(ctx) {
          const task = await plugin.syncManager.createTask(ctx.request.body);
          ctx.body = task;
        },
        async update(ctx) {
          const { id } = ctx.params;
          const task = await plugin.syncManager.updateTask(id, ctx.request.body);
          ctx.body = task;
        },
        async destroy(ctx) {
          const { id } = ctx.params;
          await plugin.syncManager.deleteTask(id);
          ctx.body = { success: true };
        },
        async run(ctx) {
          const { id } = ctx.params;
          const result = await plugin.syncManager.runTask(id);
          ctx.body = result;
        },
        async status(ctx) {
          const { id } = ctx.params;
          const status = plugin.syncManager.getTaskStatus(id);
          ctx.body = { status };
        },
      },
    });
  }
}

export default ExternalDataSourcePlugin;
