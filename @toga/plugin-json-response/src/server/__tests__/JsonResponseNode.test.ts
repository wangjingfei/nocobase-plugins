import { JsonResponseNode } from '../JsonResponseNode';
import { parse } from '../parser';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';

jest.mock('../parser');

describe('JsonResponseNode', () => {
  let node: JsonResponseNode;
  let mockInputValue: jest.Mock;
  let mockSetVariable: jest.Mock;
  let mockLoggerWarn: jest.Mock;
  let mockLoggerError: jest.Mock;

  beforeEach(() => {
    mockInputValue = jest.fn();
    mockSetVariable = jest.fn();
    mockLoggerWarn = jest.fn();
    mockLoggerError = jest.fn();

    node = new JsonResponseNode({
      nodeId: 'test-node',
      type: 'json-response',
      title: 'JSON Response',
      workflow: {
        title: 'Test Workflow',
      } as any,
    });

    // 模拟方法
    node.inputValue = mockInputValue;
    node.setVariable = mockSetVariable;
    node.logger = {
      warn: mockLoggerWarn,
      error: mockLoggerError,
    } as any;

    // 默认的nodeConfig
    node.nodeConfig = {};

    // 模拟parse函数
    (parse as jest.Mock).mockImplementation((data, expression) => {
      if (expression === '$.data.items[0].id') {
        return 'item-1';
      }
      return undefined;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should warn and return if no response data provided', async () => {
    mockInputValue.mockReturnValue(null);
    
    await node.run();
    
    expect(mockLoggerWarn).toHaveBeenCalledWith('No response data provided');
    expect(mockSetVariable).not.toHaveBeenCalled();
  });

  test('should parse JSON string data', async () => {
    const jsonString = '{"data":{"items":[{"id":"item-1"}]}}';
    mockInputValue.mockReturnValue(jsonString);
    node.nodeConfig = {
      parseMode: 'jsonPath',
      pathExpression: '$.data.items[0].id',
      outputField: 'itemId'
    };
    
    await node.run();
    
    expect(mockSetVariable).toHaveBeenCalledWith('itemId', 'item-1');
  });

  test('should use direct mode when specified', async () => {
    const data = { key: 'value' };
    mockInputValue.mockReturnValue(data);
    node.nodeConfig = {
      parseMode: 'direct',
      outputField: 'rawData'
    };
    
    await node.run();
    
    expect(mockSetVariable).toHaveBeenCalledWith('rawData', data);
  });

  test('should use fallback value when result is undefined', async () => {
    mockInputValue.mockReturnValue({});
    node.nodeConfig = {
      parseMode: 'jsonPath',
      pathExpression: '$.nonexistent.path',
      fallbackValue: 'default-value',
      outputField: 'result'
    };
    
    await node.run();
    
    expect(mockSetVariable).toHaveBeenCalledWith('result', 'default-value');
  });

  test('should use default output field if not specified', async () => {
    mockInputValue.mockReturnValue({ test: 'data' });
    node.nodeConfig = {
      parseMode: 'direct'
    };
    
    await node.run();
    
    expect(mockSetVariable).toHaveBeenCalledWith('parsedResponse', { test: 'data' });
  });

  test('should catch and throw errors by default', async () => {
    mockInputValue.mockReturnValue({});
    (parse as jest.Mock).mockImplementation(() => {
      throw new Error('Parse error');
    });
    node.nodeConfig = {
      parseMode: 'jsonPath',
      pathExpression: '$.test'
    };
    
    await expect(node.run()).rejects.toThrow('Parse error');
    expect(mockLoggerError).toHaveBeenCalledWith('Error processing JSON response', expect.any(Error));
  });

  test('should continue execution when continueOnError is true', async () => {
    mockInputValue.mockReturnValue({});
    (parse as jest.Mock).mockImplementation(() => {
      throw new Error('Parse error');
    });
    node.nodeConfig = {
      parseMode: 'jsonPath',
      pathExpression: '$.test',
      continueOnError: true
    };
    
    await node.run();
    
    expect(mockLoggerError).toHaveBeenCalledWith('Error processing JSON response', expect.any(Error));
    // 不应该抛出错误
  });
}); 