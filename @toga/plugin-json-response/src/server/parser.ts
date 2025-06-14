import JSONPath from 'jsonpath';

/**
 * 使用JSONPath语法从JSON对象中提取值
 * @param data 需要解析的JSON数据对象
 * @param expression JSONPath表达式，例如 "$.data.items[0].id" 
 * @returns 解析后的结果
 */
export function parse(data: any, expression: string): any {
  if (!data) {
    return undefined;
  }

  if (!expression) {
    return data;
  }

  try {
    // 使用JSONPath解析数据
    const result = JSONPath.query(data, expression);
    
    // 如果结果是一个数组但只有一个元素，返回该元素
    if (Array.isArray(result) && result.length === 1) {
      return result[0];
    }
    
    // 如果结果是空数组，返回undefined
    if (Array.isArray(result) && result.length === 0) {
      return undefined;
    }
    
    return result;
  } catch (error) {
    console.error('JSON解析错误:', error);
    return undefined;
  }
}

/**
 * 解析带点号的路径表达式，从对象中提取值
 * @param data 需要解析的对象
 * @param path 点号分隔的路径，例如 "user.profile.name"
 * @returns 解析后的值
 */
export function getValueByPath(data: any, path: string): any {
  if (!data || !path) {
    return undefined;
  }

  // 将路径分割为多个段
  const parts = path.split('.');
  let current = data;

  // 遍历路径段，逐级深入对象
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

/**
 * 将扁平的JSON转换为嵌套结构
 * 例如: {"user.name": "John", "user.email": "john@example.com"} 
 * 转换为: {"user": {"name": "John", "email": "john@example.com"}}
 * 
 * @param flatJson 扁平结构的JSON对象
 * @returns 嵌套结构的JSON对象
 */
export function unflattenJson(flatJson: Record<string, any>): any {
  const result: Record<string, any> = {};

  for (const key in flatJson) {
    const keys = key.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const partKey = keys[i];
      if (!current[partKey]) {
        current[partKey] = {};
      }
      current = current[partKey];
    }

    current[keys[keys.length - 1]] = flatJson[key];
  }

  return result;
} 