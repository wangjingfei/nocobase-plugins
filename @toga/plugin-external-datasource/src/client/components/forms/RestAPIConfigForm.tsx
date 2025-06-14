import React from 'react';
import { Form, Input, Select, Button, message, Space } from 'antd';
import { useAPIClient } from '@nocobase/client';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

interface RestAPIConfigFormProps {
  initialValues?: any;
  onSuccess?: (values: any) => void;
  onCancel?: () => void;
}

export const RestAPIConfigForm: React.FC<RestAPIConfigFormProps> = ({
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
        type: 'rest-api-external',
        config: {
          baseUrl: values.baseUrl,
          authentication: values.authentication,
          username: values.username,
          password: values.password,
          apiKey: values.apiKey,
          bearerToken: values.bearerToken,
          headers: values.headers || [],
        },
        enabled: true,
      };

      if (initialValues?.id) {
        await api.request({
          url: `externalDataSources/${initialValues.id}`,
          method: 'put',
          data: payload,
        });
        message.success('REST API 数据源更新成功');
      } else {
        await api.request({
          url: 'externalDataSources',
          method: 'post',
          data: payload,
        });
        message.success('REST API 数据源创建成功');
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
        type: 'rest-api-external',
        config: {
          baseUrl: values.baseUrl,
          authentication: values.authentication,
          username: values.username,
          password: values.password,
          apiKey: values.apiKey,
          bearerToken: values.bearerToken,
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
        name="baseUrl"
        label="API 基础地址"
        rules={[{ required: true, message: '请输入API基础地址' }]}
      >
        <Input placeholder="如: https://api.example.com" />
      </Form.Item>

      <Form.Item
        name="authentication"
        label="认证类型"
        initialValue="none"
      >
        <Select placeholder="选择认证方式">
          <Select.Option value="none">无认证</Select.Option>
          <Select.Option value="basic">基础认证</Select.Option>
          <Select.Option value="apikey">API Key</Select.Option>
          <Select.Option value="bearer">Bearer Token</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.authentication !== currentValues.authentication}>
        {({ getFieldValue }) => {
          const authType = getFieldValue('authentication');
          
          if (authType === 'basic') {
            return (
              <>
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="用户名" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password placeholder="密码" />
                </Form.Item>
              </>
            );
          }
          
          if (authType === 'apikey') {
            return (
              <Form.Item
                name="apiKey"
                label="API Key"
                rules={[{ required: true, message: '请输入API Key' }]}
              >
                <Input placeholder="API Key" />
              </Form.Item>
            );
          }
          
          if (authType === 'bearer') {
            return (
              <Form.Item
                name="bearerToken"
                label="Bearer Token"
                rules={[{ required: true, message: '请输入Bearer Token' }]}
              >
                <Input placeholder="Bearer Token" />
              </Form.Item>
            );
          }
          
          return null;
        }}
      </Form.Item>

      <Form.List name="headers">
        {(fields, { add, remove }) => (
          <>
            <Form.Item label="自定义请求头">
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'key']}
                    rules={[{ required: true, message: '请输入请求头名称' }]}
                  >
                    <Input placeholder="请求头名称" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    rules={[{ required: true, message: '请输入请求头值' }]}
                  >
                    <Input placeholder="请求头值" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加请求头
                </Button>
              </Form.Item>
            </Form.Item>
          </>
        )}
      </Form.List>

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