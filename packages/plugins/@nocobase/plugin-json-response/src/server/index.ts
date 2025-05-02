import { Plugin } from '@nocobase/server';
import { JsonResponseNode } from './JsonResponseNode';

export class PluginJsonResponseServer extends Plugin {
  async load() {
    this.app.on('afterInstall', async () => {
      // 插件安装后的处理逻辑
    });

    // 向工作流插件注册新节点类型
    const workflow = this.app.getPlugin('workflow');
    workflow.registerPlugin({
      type: 'json-response',
      title: process.env.NODE_ENV === 'production' ? undefined : 'JSON响应处理',
      group: 'data',
      description: process.env.NODE_ENV === 'production' ? undefined : '处理HTTP请求返回的JSON数据并解析为下游可用的变量',
      component: JsonResponseNode,
    });
  }
}

export default PluginJsonResponseServer; 