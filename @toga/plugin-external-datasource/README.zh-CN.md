# NocoBase外部数据源插件

这个插件允许你在NocoBase中连接外部数据源，如MySQL和PostgreSQL数据库，使你能够查询和管理外部数据，而无需将其迁移到你的NocoBase数据库中。

## 功能特点

- 连接多个外部数据库服务器（MySQL、PostgreSQL）
- 安全地存储和管理连接配置
- 一键测试数据库连接
- 浏览表和表结构
- 使用内置SQL编辑器执行自定义SQL查询
- 以表格形式查看查询结果

## 安装

### 方法一：从插件管理器安装

1. 在你的NocoBase应用中，导航到"设置" > "插件管理"
2. 点击"添加插件"按钮
3. 输入插件包名：`@nocobase/plugin-external-datasource`
4. 点击"安装"按钮
5. 安装后，启用该插件

### 方法二：手动安装

1. 下载插件包并解压到正确位置：

```bash
mkdir -p /path/to/nocobase/storage/plugins/@nocobase/plugin-external-datasource
tar -xvzf plugin-external-datasource.tgz -C /path/to/nocobase/storage/plugins/@nocobase/plugin-external-datasource --strip-components=1
```

2. 重启NocoBase服务器：

```bash
yarn nocobase restart
```

3. 在NocoBase管理界面的"插件管理"中启用该插件。

## 使用方法

### 管理外部数据源

1. 安装并启用插件后，管理设置菜单中会出现一个新的菜单项"外部数据源"。
2. 导航到"外部数据源"以管理你的数据库连接。
3. 点击"添加数据源"创建新连接。
4. 填写必要的连接详情：
   - 名称：数据源的描述性名称
   - 类型：选择数据库类型（MySQL或PostgreSQL）
   - 主机：数据库服务器主机地址
   - 端口：数据库服务器端口
   - 用户名：数据库用户名
   - 密码：数据库密码
   - 数据库：数据库名称
5. 点击"测试连接"验证连接是否有效
6. 点击"创建"保存数据源

### 使用SQL浏览器

1. 从数据源列表中，点击你想要查询的数据源的"SQL浏览器"图标
2. SQL浏览器提供：
   - 数据库中的表列表
   - 表结构信息
   - SQL查询编辑器
   - 结果显示区域
3. 你可以：
   - 选择一个表查看其结构
   - 点击"查询数据"生成SELECT语句
   - 编写并执行自定义SQL查询
   - 以表格形式查看查询结果

## 安全注意事项

- 数据库凭证存储在NocoBase数据库中
- 只有具有管理员访问权限的用户才能管理数据源
- 始终使用具有适当权限的数据库用户（如果可能，使用只读权限）
- 对于生产环境，请考虑使用SSL连接

## 限制

- 目前支持MySQL和PostgreSQL数据库
- 不支持与NocoBase集合自动同步架构
- 复杂查询可能会影响性能

## 许可证

该插件采用AGPL-3.0许可证。 