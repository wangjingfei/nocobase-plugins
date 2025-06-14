import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Card, Tabs, Tag } from 'antd';
import { DatabaseOutlined, CloudServerOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAPIClient } from '@nocobase/client';
import { MySQLConfigForm } from './forms/MySQLConfigForm';
import { PostgreSQLConfigForm } from './forms/PostgreSQLConfigForm';
import { RestAPIConfigForm } from './forms/RestAPIConfigForm';

const { TabPane } = Tabs;

export const ExternalDataSourceManager: React.FC = () => {
  const api = useAPIClient();
  const [dataSources, setDataSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDataSource, setCurrentDataSource] = useState(null);
  const [modalType, setModalType] = useState<'mysql-external' | 'postgresql-external' | 'rest-api-external'>('mysql-external');

  const loadDataSources = async () => {
    setLoading(true);
    try {
      const response = await api.request({
        url: 'externalDataSources',
        method: 'get',
      });
      setDataSources(response.data || []);
    } catch (error) {
      message.error('加载数据源失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataSources();
  }, []);

  const handleAdd = (type: 'mysql-external' | 'postgresql-external' | 'rest-api-external') => {
    setModalType(type);
    setCurrentDataSource(null);
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setModalType(record.type);
    setCurrentDataSource(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.request({
        url: `externalDataSources/${id}`,
        method: 'delete',
      });
      message.success('数据源删除成功');
      loadDataSources();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSync = async (id: string) => {
    try {
      await api.request({
        url: `syncTasks/${id}:run`,
        method: 'post',
      });
      message.success('同步任务已启动');
    } catch (error) {
      message.error('启动同步失败');
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    setCurrentDataSource(null);
    loadDataSources();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mysql-external':
      case 'postgresql-external':
        return <DatabaseOutlined style={{ color: '#1890ff' }} />;
      case 'rest-api-external':
        return <CloudServerOutlined style={{ color: '#52c41a' }} />;
      default:
        return <DatabaseOutlined />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mysql-external':
        return <Tag color="blue">MySQL</Tag>;
      case 'postgresql-external':
        return <Tag color="purple">PostgreSQL</Tag>;
      case 'rest-api-external':
        return <Tag color="green">REST API</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  const getConfigForm = () => {
    switch (modalType) {
      case 'mysql-external':
        return (
          <MySQLConfigForm
            initialValues={currentDataSource}
            onSuccess={handleModalSuccess}
            onCancel={() => setModalVisible(false)}
          />
        );
      case 'postgresql-external':
        return (
          <PostgreSQLConfigForm
            initialValues={currentDataSource}
            onSuccess={handleModalSuccess}
            onCancel={() => setModalVisible(false)}
          />
        );
      case 'rest-api-external':
        return (
          <RestAPIConfigForm
            initialValues={currentDataSource}
            onSuccess={handleModalSuccess}
            onCancel={() => setModalVisible(false)}
          />
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          {getTypeIcon(record.type)}
          {text}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeLabel(type),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '最后同步时间',
      dataIndex: 'lastSyncTime',
      key: 'lastSyncTime',
      render: (time: string) => time ? new Date(time).toLocaleString() : '从未同步',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            icon={<PlayCircleOutlined />} 
            onClick={() => handleSync(record.id)}
          >
            同步
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <h2>外部数据源管理</h2>
      </Card>
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleAdd('mysql-external')}
            >
              添加 MySQL 数据库
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAdd('postgresql-external')}
            >
              添加 PostgreSQL 数据库
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => handleAdd('rest-api-external')}
            >
              添加 REST API
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={dataSources}
          loading={loading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={`${currentDataSource ? '编辑' : '添加'}${
          modalType === 'mysql-external' ? 'MySQL 数据库' :
          modalType === 'postgresql-external' ? 'PostgreSQL 数据库' :
          'REST API 数据源'
        }`}
        open={modalVisible}
        footer={null}
        width={600}
        onCancel={() => setModalVisible(false)}
      >
        {getConfigForm()}
      </Modal>
    </div>
  );
}; 