# NocoBase JSON响应解析插件安装说明

## 开发环境安装

### 前提条件

- Node.js (v16+)
- Yarn
- 已克隆NocoBase主仓库

### 安装步骤

1. 进入NocoBase项目根目录
2. 执行以下命令克隆插件到正确位置：

```bash
git clone https://github.com/wangjingfei/nocobase-plugins.git packages/plugins
```

3. 安装依赖：

```bash
yarn install
```

4. 构建插件：

```bash
yarn nocobase build plugin-json-response
```

5. 启用插件：

在NocoBase管理界面中的"插件管理"中启用"JSON响应处理"插件。

## 生产环境安装

### 方法一：从插件管理界面安装

1. 进入NocoBase管理界面
2. 导航到"设置" > "插件管理"
3. 点击"添加插件"按钮
4. 输入插件包名：`@toga/plugin-json-response`
5. 点击"安装"按钮
6. 安装完成后，启用该插件

### 方法二：手动安装

1. 下载插件包并解压到正确位置：

```bash
mkdir -p /path/to/nocobase/storage/plugins/@toga/plugin-json-response
tar -xvzf plugin-json-response.tgz -C /path/to/nocobase/storage/plugins/@toga/plugin-json-response --strip-components=1
```

2. 重启NocoBase服务：

```bash
yarn nocobase restart
```

3. 在NocoBase管理界面的"插件管理"中启用"JSON响应处理"插件。

## 依赖项

此插件依赖于以下NocoBase核心插件：

- `@nocobase/plugin-workflow` - 工作流插件

请确保在安装此插件前已安装并启用上述依赖项。

## 验证安装

安装并启用插件后，您可以通过以下步骤验证安装是否成功：

1. 创建一个新的工作流
2. 在节点列表中查找"JSON响应处理"节点（在"数据"分组下）
3. 如果能找到该节点并能添加到工作流中，则说明安装成功

## 故障排除

如果在安装过程中遇到问题，请尝试以下解决方案：

1. 检查NocoBase版本是否兼容（0.x 版本）
2. 确保依赖的工作流插件已安装并启用
3. 检查浏览器控制台是否有错误信息
4. 检查服务器日志是否有错误

如问题仍未解决，请联系支持团队或在GitHub仓库提交Issue。 