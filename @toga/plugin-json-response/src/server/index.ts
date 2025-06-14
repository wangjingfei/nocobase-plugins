import { Plugin } from '@nocobase/server';
import { JsonResponseNode } from './JsonResponseNode';

export class PluginJsonResponseServer extends Plugin {
  async load() {
    this.app.on('afterInstall', async () => {
      // 插件安装后的处理逻辑
    });

    // TODO: 等确认正确的工作流注册API后再添加
    // 向工作流插件注册新节点类型
    // const workflow = this.app.getPlugin('workflow');
  }
}

export default PluginJsonResponseServer; 