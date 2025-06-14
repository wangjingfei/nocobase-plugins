import { Plugin } from '@nocobase/server';
import { DataSourceManager } from '../data-source-manager';
import { SyncTaskConfig, SyncResult } from './sync-task';
import { SyncWorker } from './sync-worker';
import { EventEmitter } from 'events';

export class SyncManager extends EventEmitter {
  private plugin: Plugin;
  private dataSourceManager: DataSourceManager;
  private tasks: Map<string, SyncTaskConfig> = new Map();
  private workers: Map<string, SyncWorker> = new Map();

  constructor(plugin: Plugin, dataSourceManager: DataSourceManager) {
    super();
    this.plugin = plugin;
    this.dataSourceManager = dataSourceManager;
  }

  async init() {
    // 检查数据库是否已经初始化
    if (!this.plugin.db) {
      console.warn('数据库未初始化，跳过同步任务加载');
      return;
    }

    try {
      // 从数据库加载同步任务配置
      const taskConfigs = await this.plugin.db.getRepository('syncTasks').find();
      for (const config of taskConfigs) {
        this.tasks.set(config.id, config);
        if (config.schedule) {
          this.scheduleTask(config);
        }
      }
    } catch (error) {
      console.warn('加载同步任务配置失败:', error.message);
    }
  }

  async createTask(config: Omit<SyncTaskConfig, 'id' | 'status'>): Promise<SyncTaskConfig> {
    const task: SyncTaskConfig = {
      ...config,
      id: Date.now().toString(),
      status: 'idle',
    };

    await this.plugin.db.getRepository('syncTasks').create({
      values: task,
    });

    this.tasks.set(task.id, task);
    if (task.schedule) {
      this.scheduleTask(task);
    }

    return task;
  }

  async updateTask(id: string, config: Partial<SyncTaskConfig>): Promise<SyncTaskConfig> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`同步任务不存在: ${id}`);
    }

    const updatedTask = { ...task, ...config };
    await this.plugin.db.getRepository('syncTasks').update({
      filter: { id },
      values: config,
    });

    this.tasks.set(id, updatedTask);
    if (config.schedule) {
      this.scheduleTask(updatedTask);
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`同步任务不存在: ${id}`);
    }

    await this.plugin.db.getRepository('syncTasks').destroy({
      filter: { id },
    });

    this.tasks.delete(id);
    this.workers.delete(id);
  }

  async runTask(id: string): Promise<SyncResult> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`同步任务不存在: ${id}`);
    }

    const dataSource = this.dataSourceManager.getDataSource(task.dataSourceId);
    if (!dataSource) {
      throw new Error(`数据源不存在: ${task.dataSourceId}`);
    }

    const worker = new SyncWorker(task, dataSource);
    this.workers.set(id, worker);

    try {
      const result = await worker.run();
      await this.updateTask(id, {
        status: 'completed',
        lastSyncTime: new Date(),
      });
      return result;
    } catch (error) {
      await this.updateTask(id, {
        status: 'failed',
      });
      throw error;
    } finally {
      this.workers.delete(id);
    }
  }

  private scheduleTask(task: SyncTaskConfig) {
    // 使用 node-cron 实现定时任务
    // TODO: 实现定时任务调度
  }

  getTask(id: string): SyncTaskConfig | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): SyncTaskConfig[] {
    return Array.from(this.tasks.values());
  }

  getTaskStatus(id: string): string {
    const worker = this.workers.get(id);
    if (worker) {
      return 'running';
    }
    return this.tasks.get(id)?.status || 'unknown';
  }
} 