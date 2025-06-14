import { DataSource } from '../data-source';
import { SyncTaskConfig, SyncResult } from './sync-task';

export class SyncWorker {
  private task: SyncTaskConfig;
  private dataSource: DataSource;
  private batchSize: number = 1000;

  constructor(task: SyncTaskConfig, dataSource: DataSource) {
    this.task = task;
    this.dataSource = dataSource;
  }

  async run(): Promise<SyncResult> {
    const startTime = new Date();
    let totalRecords = 0;
    let successRecords = 0;
    let failedRecords = 0;
    let error: string | undefined;

    try {
      // 构建查询条件
      let query = `SELECT * FROM ${this.task.sourceTable}`;
      if (this.task.filter) {
        query += ` WHERE ${this.task.filter}`;
      }
      if (this.task.syncMode === 'incremental' && this.task.lastSyncTime) {
        query += this.task.filter ? ' AND ' : ' WHERE ';
        query += `updated_at > '${this.task.lastSyncTime.toISOString()}'`;
      }

      // 分批处理数据
      let offset = 0;
      while (true) {
        const batchQuery = `${query} LIMIT ${this.batchSize} OFFSET ${offset}`;
        const result = await this.dataSource.query(batchQuery);
        
        if (result.data.length === 0) {
          break;
        }

        totalRecords += result.data.length;

        // 处理每一批数据
        for (const record of result.data) {
          try {
            await this.processRecord(record);
            successRecords++;
          } catch (err) {
            failedRecords++;
            console.error(`处理记录失败:`, err);
          }
        }

        offset += this.batchSize;
      }

      return {
        taskId: this.task.id,
        startTime,
        endTime: new Date(),
        status: 'success',
        totalRecords,
        successRecords,
        failedRecords,
      };
    } catch (err) {
      error = err.message;
      return {
        taskId: this.task.id,
        startTime,
        endTime: new Date(),
        status: 'failed',
        totalRecords,
        successRecords,
        failedRecords,
        error,
      };
    }
  }

  private async processRecord(record: any) {
    // 转换数据
    const transformedData = this.transformRecord(record);

    // 构建插入或更新语句
    const fields = Object.keys(transformedData);
    const values = Object.values(transformedData);
    const placeholders = values.map(() => '?').join(', ');

    const query = `
      INSERT INTO ${this.task.targetTable} (${fields.join(', ')})
      VALUES (${placeholders})
      ON DUPLICATE KEY UPDATE
      ${fields.map(field => `${field} = VALUES(${field})`).join(', ')}
    `;

    await this.dataSource.query(query, values);
  }

  private transformRecord(record: any): any {
    const transformed: any = {};
    
    for (const mapping of this.task.mapping) {
      let value = record[mapping.sourceField];
      
      // 应用转换表达式
      if (mapping.transform) {
        try {
          // 这里可以实现更复杂的转换逻辑
          value = this.evaluateTransform(value, mapping.transform);
        } catch (err) {
          console.error(`转换字段失败: ${mapping.sourceField}`, err);
        }
      }
      
      transformed[mapping.targetField] = value;
    }
    
    return transformed;
  }

  private evaluateTransform(value: any, transform: string): any {
    // 这里可以实现更复杂的转换表达式解析
    // 目前只支持简单的字符串替换
    return transform.replace('${value}', value);
  }
} 