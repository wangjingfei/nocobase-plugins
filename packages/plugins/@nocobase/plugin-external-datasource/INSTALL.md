# NocoBase 外部数据源插件安装说明

## 开发环境安装

### 前提条件

- Node.js (v16+)
- Yarn
- 已克隆 NocoBase 主仓库

### 安装步骤

1. 进入 NocoBase 项目根目录
2. 执行以下命令克隆插件到正确位置：

```bash
git clone https://github.com/your-username/plugin-external-datasource.git packages/plugins/@nocobase/plugin-external-datasource
```

3. 安装依赖：

```bash
yarn install
```

4. 构建插件：

```bash
yarn nocobase build plugin-external-datasource
```

5. 启用插件：

在 NocoBase 管理界面中的"插件管理"中启用"外部数据源"插件。

## 生产环境安装

### 方法一：从插件管理界面安装

1. 进入 NocoBase 管理界面
2. 导航到"设置" > "插件管理"
3. 点击"添加插件"按钮
4. 输入插件包名：`@nocobase/plugin-external-datasource`
5. 点击"安装"按钮
6. 安装完成后，启用该插件

### 方法二：手动安装

1. 下载插件包并解压到正确位置：

```bash
mkdir -p /path/to/nocobase/storage/plugins/@nocobase/plugin-external-datasource
tar -xvzf plugin-external-datasource.tgz -C /path/to/nocobase/storage/plugins/@nocobase/plugin-external-datasource --strip-components=1
```

2. 重启 NocoBase 服务：

```bash
yarn nocobase restart
```

3. 在 NocoBase 管理界面的"插件管理"中启用"外部数据源"插件。

## 依赖项

此插件依赖于以下外部库：

- `mysql2` - MySQL 数据库驱动
- `pg` - PostgreSQL 数据库驱动
- `sequelize` - ORM 库，用于数据库操作

这些依赖项将在插件安装过程中自动安装。

## 验证安装

安装并启用插件后，您可以通过以下步骤验证安装是否成功：

1. 登录 NocoBase 管理界面
2. 导航到"设置"菜单
3. 检查是否存在"外部数据源"菜单项
4. 如果能看到该菜单项并能够访问数据源管理页面，则说明安装成功

## 故障排除

如果在安装过程中遇到问题，请尝试以下解决方案：

1. 检查 NocoBase 版本是否兼容（0.x 版本）
2. 确保 Node.js 和 Yarn 版本符合要求
3. 检查浏览器控制台是否有错误信息
4. 检查服务器日志是否有错误

### 常见问题

1. **问题**：安装后找不到"外部数据源"菜单
   **解决方案**：确保插件已在插件管理中启用，并刷新页面

2. **问题**：连接数据库失败
   **解决方案**：
   - 检查数据库连接参数是否正确
   - 确保 NocoBase 服务器可以访问目标数据库
   - 检查防火墙设置是否允许连接

3. **问题**：构建插件失败
   **解决方案**：
   - 确保所有依赖项已正确安装
   - 检查 Node.js 版本是否符合要求
   - 清除缓存并重新构建：`yarn clean && yarn build`

如问题仍未解决，请联系支持团队或在 GitHub 仓库提交 Issue。 