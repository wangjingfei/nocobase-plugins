# NocoBase 外部数据源插件

这个插件为 NocoBase 提供了连接外部数据源的功能，支持 MySQL、PostgreSQL 和 REST API 数据源。

## 功能特性

- **多种数据源类型支持**：
  - MySQL 外部数据库
  - PostgreSQL 外部数据库
  - REST API 数据源

- **完整的管理界面**：
  - 可视化配置表单
  - 连接测试功能
  - 数据源状态管理
  - 数据同步功能

- **安全性**：
  - 支持多种认证方式
  - 连接信息加密存储

## 安装与配置

### 1. 插件激活

1. 在 NocoBase 管理后台，进入 **插件管理**
2. 找到 **外部数据源插件** 并点击激活
3. 激活成功后，插件会出现在设置菜单中

### 2. 访问插件

激活插件后，您可以通过以下方式访问：

- 在 NocoBase 后台，进入 **设置** > **外部数据源**

## 使用方法

### 添加 MySQL 数据库

1. 点击 **添加 MySQL 数据库** 按钮
2. 填写连接信息：
   - 数据源名称：为数据源指定一个唯一的名称
   - 主机地址：MySQL 服务器地址
   - 端口：通常为 3306
   - 数据库名：要连接的数据库名称
   - 用户名和密码：数据库认证信息
3. 点击 **测试连接** 验证配置
4. 保存配置

### 添加 PostgreSQL 数据库

1. 点击 **添加 PostgreSQL 数据库** 按钮
2. 填写连接信息：
   - 数据源名称：为数据源指定一个唯一的名称
   - 主机地址：PostgreSQL 服务器地址
   - 端口：通常为 5432
   - 数据库名：要连接的数据库名称
   - 用户名和密码：数据库认证信息
   - 模式名：默认为 "public"
3. 点击 **测试连接** 验证配置
4. 保存配置

### 添加 REST API 数据源

1. 点击 **添加 REST API** 按钮
2. 填写 API 信息：
   - 数据源名称：为数据源指定一个唯一的名称
   - API 基础地址：REST API 的基础 URL
   - 认证类型：选择合适的认证方式
     - 无认证
     - 基础认证（用户名/密码）
     - API Key
     - Bearer Token
   - 自定义请求头：可添加额外的 HTTP 头部
3. 点击 **测试连接** 验证配置
4. 保存配置

## 数据同步

对于配置好的数据源，您可以：

1. 点击数据源列表中的 **同步** 按钮启动数据同步
2. 查看最后同步时间
3. 监控同步状态

## API 接口

插件提供了以下 API 接口：

- `GET /api/externalDataSources` - 获取所有外部数据源
- `POST /api/externalDataSources` - 创建新的数据源
- `PUT /api/externalDataSources/:id` - 更新数据源配置
- `DELETE /api/externalDataSources/:id` - 删除数据源
- `POST /api/externalDataSources:test` - 测试数据源连接

## 故障排除

### 连接测试失败

1. **网络问题**：确保 NocoBase 服务器可以访问目标数据库/API
2. **认证错误**：检查用户名、密码或 API 密钥是否正确
3. **端口问题**：确认目标服务的端口是否正确
4. **防火墙**：检查是否有防火墙阻止连接

### 插件未显示

1. 确认插件已正确激活
2. 检查用户权限，确保有访问插件的权限
3. 尝试刷新页面或重新登录

## 技术支持

如遇到问题，请：

1. 检查 NocoBase 系统日志
2. 确认数据库连接配置
3. 提供详细的错误信息以便排查

## 开发说明

这个插件基于 NocoBase 插件系统开发，主要文件结构：

```
src/
├── client/           # 前端代码
│   ├── components/   # React 组件
│   └── index.ts      # 客户端入口
└── server/           # 服务端代码
    ├── connectors/   # 数据源连接器
    ├── data-source-manager.ts
    └── index.ts      # 服务端入口
```
