import React from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { useAPIClient } from '@nocobase/client';

interface MySQLConfigFormProps {
  initialValues?: any;
  onSuccess?: (values: any) => void;
  onCancel?: () => void;
}

export const MySQLConfigForm: React.FC<MySQLConfigFormProps> = ({
  initialValues,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const api = useAPIClient();

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        type: 'mysql-external',
        config: {
          host: values.host,
          port: values.port,
          username: values.username,
          password: values.password,
          database: values.database,
          charset: values.charset || 'utf8mb4',
          timezone: values.timezone || '+00:00',
        },
        enabled: true,
      };

      if (initialValues?.id) {
        await api.request({
          url: `externalDataSources/${initialValues.id}`,
          method: 'put',
          data: payload,
        });
        message.success('MySQL 数据源更新成功');
      } else {
        await api.request({
          url: 'externalDataSources',
          method: 'post',
          data: payload,
        });
        message.success('MySQL 数据源创建成功');
      }
      onSuccess?.(payload);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleTest = async () => {
    try {
      const values = await form.validateFields();
      const testPayload = {
        type: 'mysql-external',
        config: {
          host: values.host,
          port: values.port,
          username: values.username,
          password: values.password,
          database: values.database,
        },
      };

      const response = await api.request({
        url: 'externalDataSources:test',
        method: 'post',
        data: testPayload,
      });

      if (response.data.success) {
        message.success('连接测试成功');
      } else {
        message.error(`连接测试失败: ${response.data.error || '未知错误'}`);
      }
    } catch (error) {
      message.error('连接测试失败');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="数据源名称"
        rules={[{ required: true, message: '请输入数据源名称' }]}
      >
        <Input placeholder="为此数据源输入一个唯一的名称" />
      </Form.Item>

      <Form.Item
        name="host"
        label="主机地址"
        rules={[{ required: true, message: '请输入主机地址' }]}
      >
        <Input placeholder="如: localhost 或 192.168.1.100" />
      </Form.Item>

      <Form.Item
        name="port"
        label="端口"
        rules={[{ required: true, message: '请输入端口号' }]}
        initialValue={3306}
      >
        <InputNumber min={1} max={65535} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="database"
        label="数据库名"
        rules={[{ required: true, message: '请输入数据库名' }]}
      >
        <Input placeholder="要连接的数据库名称" />
      </Form.Item>

      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="数据库用户名" />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="数据库密码" />
      </Form.Item>

      <Form.Item name="charset" label="字符集" initialValue="utf8mb4">
        <Input placeholder="字符集，默认: utf8mb4" />
      </Form.Item>

      <Form.Item name="timezone" label="时区" initialValue="+00:00">
        <Input placeholder="时区，默认: +00:00" />
      </Form.Item>

      <Form.Item>
        <Button type="default" onClick={handleTest} style={{ marginRight: 8 }}>
          测试连接
        </Button>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          保存
        </Button>
        <Button onClick={onCancel}>
          取消
        </Button>
      </Form.Item>
    </Form>
  );
}; 