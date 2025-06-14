import { JpNode } from '@nocobase/plugin-workflow/server';
import { parse } from './parser';

export class JsonResponseNode extends JpNode {
  async run() {
    // 获取上游节点传递的HTTP响应数据
    const responseData = this.inputValue('responseData');

    if (!responseData) {
      this.logger.warn('No response data provided');
      return;
    }

    // 获取配置选项
    const options = this.nodeConfig;
    const { pathExpression, outputField, parseMode = 'jsonPath', fallbackValue } = options;

    try {
      let result;
      let rawData = responseData;

      // 如果数据是字符串，尝试将其解析为JSON对象
      if (typeof responseData === 'string') {
        try {
          rawData = JSON.parse(responseData);
        } catch (e) {
          this.logger.warn('Failed to parse response data as JSON', e);
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
      if (outputField) {
        this.setVariable(outputField, result);
      } else {
        this.setVariable('parsedResponse', result);
      }

    } catch (e) {
      this.logger.error('Error processing JSON response', e);
      // 如果配置了错误处理方式为继续执行，则不抛出错误
      if (options.continueOnError !== true) {
        throw e;
      }
    }
  }
} 