import React, { useState } from 'react';
import { Form, Input, Select, Button, InputNumber, Switch, Collapse, Card, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAPIClient } from '@nocobase/client';

const { Option } = Select;
const { Panel } = Collapse;

interface DatasourceFormProps {
  record?: any;
  onSuccess?: () => void;
}

export const DatasourceForm: React.FC<DatasourceFormProps> = ({ record, onSuccess }) => {
  const { t } = useTranslation('external-datasource');
  const api = useAPIClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(record?.type || 'mysql');

  // 表单初始值
  const initialValues = record ? {
    ...record,
    options: record.options || {},
  } : {
    name: '',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: '',
    password: '',
    database: '',
    enabled: true,
    options: {},
  };

  // 根据数据库类型设置默认端口
  const handleTypeChange = (value) => {
    setSelectedType(value);
    const portMap = {
      mysql: 3306,
      postgres: 5432,
    };
    form.setFieldsValue({ port: portMap[value] });
  };

  // 测试连接
  const handleTestConnection = async () => {
    try {
      await form.validateFields(['type', 'host', 'port', 'username', 'password', 'database']);
      const values = form.getFieldsValue();

      setTestLoading(true);
      const response = await api.resource('external-datasources').test({
        values: {
          type: values.type,
          host: values.host,
          port: values.port,
          username: values.username,
          password: values.password,
          database: values.database,
          options: values.options,
        },
      });

      if (response.data.success) {
        message.success(t('Connection successful'));
      } else {
        message.error(response.data.message || t('Connection failed'));
      }
    } catch (error) {
      message.error(t('Connection failed: Please check your input'));
    } finally {
      setTestLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      if (record?.id) {
        // 更新
        await api.resource('external-datasources').update({
          filter: { id: record.id },
          values,
        });
        message.success(t('Datasource updated successfully'));
      } else {
        // 创建
        await api.resource('external-datasources').create({
          values,
        });
        message.success(t('Datasource created successfully'));
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Submit error:', error);
      message.error(t('Operation failed'));
    } finally {
      setLoading(false);
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
        label={t('Name')}
        rules={[{ required: true, message: t('Please input the datasource name') }]}
      >
        <Input placeholder={t('Enter a descriptive name')} />
      </Form.Item>

      <Form.Item
        name="type"
        label={t('Type')}
        rules={[{ required: true, message: t('Please select the database type') }]}
      >
        <Select onChange={handleTypeChange}>
          <Option value="mysql">MySQL</Option>
          <Option value="postgres">PostgreSQL</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="host"
        label={t('Host')}
        rules={[{ required: true, message: t('Please input the host') }]}
      >
        <Input placeholder="localhost" />
      </Form.Item>

      <Form.Item
        name="port"
        label={t('Port')}
        rules={[{ required: true, message: t('Please input the port') }]}
      >
        <InputNumber min={1} max={65535} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="username"
        label={t('Username')}
        rules={[{ required: true, message: t('Please input the username') }]}
      >
        <Input placeholder={t('Database username')} />
      </Form.Item>

      <Form.Item
        name="password"
        label={t('Password')}
        rules={[{ required: true, message: t('Please input the password') }]}
      >
        <Input.Password placeholder={t('Database password')} />
      </Form.Item>

      <Form.Item
        name="database"
        label={t('Database Name')}
        rules={[{ required: true, message: t('Please input the database name') }]}
      >
        <Input placeholder={t('Database name')} />
      </Form.Item>

      <Form.Item
        name="enabled"
        label={t('Enabled')}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Collapse bordered={false} style={{ marginBottom: 24 }}>
        <Panel header={t('Advanced Options')} key="advanced">
          {selectedType === 'mysql' && (
            <>
              <Form.Item
                name={['options', 'charset']}
                label={t('Charset')}
              >
                <Input placeholder="utf8mb4" />
              </Form.Item>
              <Form.Item
                name={['options', 'timezone']}
                label={t('Timezone')}
              >
                <Input placeholder="+08:00" />
              </Form.Item>
            </>
          )}
          
          {selectedType === 'postgres' && (
            <>
              <Form.Item
                name={['options', 'schema']}
                label={t('Schema')}
              >
                <Input placeholder="public" />
              </Form.Item>
              <Form.Item
                name={['options', 'ssl']}
                label={t('SSL')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </>
          )}
        </Panel>
      </Collapse>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleTestConnection} loading={testLoading}>
          {t('Test Connection')}
        </Button>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {record ? t('Update') : t('Create')}
          </Button>
        </Space>
      </div>
    </Form>
  );
}; 