import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Button, 
  Card, 
  Table, 
  Space, 
  Popconfirm, 
  message, 
  Badge, 
  Modal, 
  Tooltip 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { 
  SchemaComponent,
  useAPIClient,
  useRequest
} from '@nocobase/client';
import { DatasourceForm } from './DatasourceForm';

export const DatasourceConfiguration = () => {
  const { t } = useTranslation('external-datasource');
  const api = useAPIClient();
  const [visible, setVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // 获取数据源列表
  const { data, loading, refresh } = useRequest({
    url: 'external-datasources',
    method: 'get',
  });

  // 删除数据源
  const handleDelete = async (record) => {
    try {
      await api.resource('external-datasources').destroy({
        filter: {
          id: record.id,
        },
      });
      message.success(t('Datasource deleted successfully'));
      refresh();
    } catch (error) {
      message.error(t('Failed to delete datasource'));
    }
  };

  // 测试连接
  const handleTestConnection = async (record) => {
    setTestingConnection(true);
    try {
      const response = await api.resource('external-datasources').test({
        values: {
          type: record.type,
          host: record.host,
          port: record.port,
          username: record.username,
          password: record.password,
          database: record.database,
          options: record.options,
        },
      });
      
      if (response.data.success) {
        message.success(t('Connection successful'));
      } else {
        message.error(response.data.message || t('Connection failed'));
      }
    } catch (error) {
      message.error(t('Connection failed'));
    } finally {
      setTestingConnection(false);
    }
  };

  // 打开SQL浏览器
  const handleOpenSQLExplorer = (record) => {
    window.open(`/admin/settings/external-datasources/${record.id}/sql`, '_blank');
  };

  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Type'),
      dataIndex: 'type',
      key: 'type',
      render: (text) => text === 'mysql' ? 'MySQL' : text === 'postgres' ? 'PostgreSQL' : text,
    },
    {
      title: t('Host'),
      dataIndex: 'host',
      key: 'host',
    },
    {
      title: t('Database'),
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: t('Status'),
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <Badge 
          status={enabled ? 'success' : 'error'} 
          text={enabled ? t('Enabled') : t('Disabled')} 
        />
      ),
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title={t('Test Connection')}>
            <Button 
              type="text" 
              icon={<PlayCircleOutlined />} 
              onClick={() => handleTestConnection(record)}
              loading={testingConnection}
            />
          </Tooltip>
          <Tooltip title={t('SQL Explorer')}>
            <Button 
              type="text" 
              icon={<CodeOutlined />} 
              onClick={() => handleOpenSQLExplorer(record)}
            />
          </Tooltip>
          <Tooltip title={t('Edit')}>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => {
                setEditingRecord(record);
                setVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <Popconfirm
              title={t('Are you sure to delete this datasource?')}
              onConfirm={() => handleDelete(record)}
              okText={t('Yes')}
              cancelText={t('No')}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={t('External Datasources')}
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingRecord(null);
            setVisible(true);
          }}
        >
          {t('Add Datasource')}
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={data?.data} 
        rowKey="id" 
        loading={loading}
      />

      <Modal
        title={editingRecord ? t('Edit Datasource') : t('Add Datasource')}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={700}
      >
        <DatasourceForm 
          record={editingRecord} 
          onSuccess={() => {
            setVisible(false);
            refresh();
          }}
        />
      </Modal>
    </Card>
  );
}; 