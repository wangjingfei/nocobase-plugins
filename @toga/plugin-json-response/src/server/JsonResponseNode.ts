import { Instruction } from '@nocobase/plugin-workflow';
import { parse } from './parser';

export class JsonResponseNode extends Instruction {
  async run(node: any, input: any, processor: any) {
    // 获取上游节点传递的HTTP响应数据
    const responseData = processor.getJobInput(node.config?.responseData || 'data');

    if (!responseData) {
      processor.logger.warn('No response data provided');
      return {
        result: null,
        status: 0
      };
    }

    // 获取配置选项
    const { pathExpression, outputField, parseMode = 'jsonPath', fallbackValue } = node.config || {};

    try {
      let result;
      let rawData = responseData;

      // 如果数据是字符串，尝试将其解析为JSON对象
      if (typeof responseData === 'string') {
        try {
          rawData = JSON.parse(responseData);
        } catch (e) {
          processor.logger.warn('Failed to parse response data as JSON', e);
          // 如果解析失败，保持原始字符串
        }
      }

      // 根据配置的解析模式处理数据
      if (parseMode === 'jsonPath' && pathExpression) {
        // 使用JSONPath解析数据
        result = parse(rawData, pathExpression);
      } else if (parseMode === 'direct') {
        // 直接使用原始数据
        result = rawData;
      } else {
        result = rawData;
      }

      // 如果结果为undefined或null，且配置了默认值，则使用默认值
      if ((result === undefined || result === null) && fallbackValue !== undefined) {
        result = fallbackValue;
      }

      // 保存解析结果到指定的输出字段
      const fieldName = outputField || 'parsedResponse';
      return {
        result: {
          [fieldName]: result
        },
        status: 0
      };

    } catch (e) {
      processor.logger.error('Error processing JSON response', e);
      // 如果配置了错误处理方式为继续执行，则不抛出错误
      if (node.config?.continueOnError !== true) {
        return {
          result: null,
          status: -1
        };
      }
      return {
        result: {},
        status: 0
      };
    }
  }
} 