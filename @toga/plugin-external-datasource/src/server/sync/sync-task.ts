export interface SyncTaskConfig {
  id: string;
  name: string;
  dataSourceId: string;
  sourceTable: string;
  targetTable: string;
  syncMode: 'full' | 'incremental';
  schedule?: string; // cron 表达式
  mapping: {
    sourceField: string;
    targetField: string;
    transform?: string; // 转换表达式
  }[];
  filter?: string; // 过滤条件
  lastSyncTime?: Date;
  status: 'idle' | 'running' | 'failed' | 'completed';
}

export interface SyncResult {
  taskId: string;
  startTime: Date;
  endTime: Date;
  status: 'success' | 'failed';
  totalRecords: number;
  successRecords: number;
  failedRecords: number;
  error?: string;
} 