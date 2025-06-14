import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useAPIClient } from '@nocobase/client';

interface DataSourceConfigProps {
  initialValues?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DataSourceConfig: React.FC<DataSourceConfigProps> = ({
  initialValues,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const api = useAPIClient();

  const handleSubmit = async (values: any) => {
    try {
      if (initialValues?.id) {
        await api.request({
          url: `dataSources/${initialValues.id}`,
          method: 'put',
          data: values,
        });
        message.success('数据源更新成功');
      } else {
        await api.request({
          url: 'dataSources',
          method: 'post',
          data: values,
        });
        message.success('数据源创建成功');
      }
      onSuccess?.();
    } catch (error) {
      message.error('操作失败');
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
        label="名称"
        rules={[{ required: true, message: '请输入数据源名称' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="type"
        label="类型"
        rules={[{ required: true, message: '请选择数据源类型' }]}
      >
        <Select>
          <Select.Option value="mysql">MySQL</Select.Option>
          <Select.Option value="postgres">PostgreSQL</Select.Option>
          <Select.Option value="rest">REST API</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name={['config', 'url']}
        label="连接地址"
        rules={[{ required: true, message: '请输入连接地址' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name={['config', 'username']} label="用户名">
        <Input />
      </Form.Item>

      <Form.Item name={['config', 'password']} label="密码">
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          取消
        </Button>
      </Form.Item>
    </Form>
  );
}; 