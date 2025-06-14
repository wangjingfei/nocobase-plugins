# NocoBase JSON响应解析插件

这个插件为NocoBase工作流添加了一个用于解析HTTP请求返回的JSON数据的节点。它可以帮助从复杂的JSON响应中提取特定数据，供下游节点使用。

## 功能特点

- 使用JSONPath语法解析JSON响应数据
- 从复杂JSON结构中提取特定值
- 当解析失败时设置默认值
- 可选择在解析失败时仍继续工作流执行
- 多种解析模式：JSONPath或直接访问

## 使用方法

### 安装

1. 在NocoBase应用中导航到插件管理页面
2. 点击"添加与更新"按钮
3. 安装"@nocobase/plugin-json-response"插件
4. 启用插件

### 工作流节点配置

安装后，在工作流编辑器的"数据"组中将提供一个新的节点类型"JSON响应处理"。

#### 配置选项

- **响应数据**：指定包含HTTP响应数据的变量名（默认："data"）
- **解析模式**：选择JSONPath或直接解析模式
- **路径表达式**：使用JSONPath模式时，指定JSONPath表达式（例如："$.data.items[0].id"）
- **输出字段**：存储解析结果的变量名（默认："parsedResponse"）
- **默认值**：解析返回空结果时使用的值
- **忽略错误**：即使解析失败，也继续执行工作流

### JSONPath语法

该插件使用[JSONPath](https://github.com/dchester/jsonpath)语法导航JSON结构。一些示例：

- `$.store.book[0].title` - 获取第一本书的标题
- `$.store.book[*].author` - 获取所有书籍的所有作者
- `$..price` - 获取JSON结构中的所有价格
- `$.store.book[?(@.price < 10)]` - 获取所有价格低于$10的书籍

## 使用示例

1. 创建一个带有HTTP请求节点的工作流
2. 在HTTP请求节点后添加一个JSON响应处理节点
3. 配置JSON响应节点以提取特定数据
4. 在下游节点中使用提取的数据

## 支持

对于问题、疑问或反馈，请在NocoBase GitHub仓库提交issue或联系NocoBase社区。

## 许可证

该插件采用AGPL-3.0许可证。 