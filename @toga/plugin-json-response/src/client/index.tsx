import { Plugin } from '@nocobase/client';
// import { JsonResponseInstruction } from './JsonResponseInstruction';
import './locale';

export class PluginJsonResponseClient extends Plugin {
  async load() {
    // TODO: 等确认正确的工作流注册API后再添加
    // 获取工作流插件
    // const workflow = this.app.pm.get('workflow');
    // if (!workflow) {
    //   return;
    // }

    // 注册节点指令组件
    // workflow.registerInstructions({
    //   'json-response': JsonResponseInstruction
    // });
  }
}

export default PluginJsonResponseClient; 