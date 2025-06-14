import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Card, Tag, Dropdown } from 'antd';
import { DatabaseOutlined, CloudServerOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, DownOutlined } from '@ant-design/icons';
import { useAPIClient } from '@nocobase/client';
import { MySQLConfigForm } from './forms/MySQLConfigForm';
import { PostgreSQLConfigForm } from './forms/PostgreSQLConfigForm';
import { RestAPIConfigForm } from './forms/RestAPIConfigForm';

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
      console.error('加载数据源失败:', error);
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
        return <Tag color="blue">MySQL 外部数据库</Tag>;
      case 'postgresql-external':
        return <Tag color="purple">PostgreSQL 外部数据库</Tag>;
      case 'rest-api-external':
        return <Tag color="green">REST API 数据源</Tag>;
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

  // 添加数据源下拉菜单项
  const addDataSourceMenuItems = [
    {
      key: 'mysql-external',
      label: (
        <Space>
          <DatabaseOutlined style={{ color: '#1890ff' }} />
          MySQL 外部数据库
        </Space>
      ),
      onClick: () => handleAdd('mysql-external'),
    },
    {
      key: 'postgresql-external',
      label: (
        <Space>
          <DatabaseOutlined style={{ color: '#722ed1' }} />
          PostgreSQL 外部数据库
        </Space>
      ),
      onClick: () => handleAdd('postgresql-external'),
    },
    {
      key: 'rest-api-external',
      label: (
        <Space>
          <CloudServerOutlined style={{ color: '#52c41a' }} />
          REST API 数据源
        </Space>
      ),
      onClick: () => handleAdd('rest-api-external'),
    },
  ];

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          {getTypeIcon(record.type)}
          <span style={{ fontWeight: 500 }}>{text}</span>
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
        <Tag color={enabled ? 'success' : 'error'}>
          {enabled ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '最后同步时间',
      dataIndex: 'lastSyncTime',
      key: 'lastSyncTime',
      render: (time: string) => time ? new Date(time).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record: any) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<PlayCircleOutlined />} 
            onClick={() => handleSync(record.id)}
          >
            同步
          </Button>
          <Button 
            type="link" 
            danger 
            size="small"
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
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, margin: 0 }}>外部数据源</h1>
        <p style={{ color: '#666', marginTop: 8, marginBottom: 0 }}>
          管理外部数据库和API连接，支持数据同步和实时访问
        </p>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>数据源列表</h3>
          </div>
          <Dropdown 
            menu={{ items: addDataSourceMenuItems }}
            placement="bottomRight"
          >
            <Button type="primary" icon={<PlusOutlined />}>
              添加数据源 <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <Table
          columns={columns}
          dataSource={dataSources}
          loading={loading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
            pageSize: 10,
            showLessItems: true,
          }}
          locale={{
            emptyText: '暂无数据源，请点击上方"添加数据源"按钮开始配置',
          }}
        />
      </Card>

      <Modal
        title={`${currentDataSource ? '编辑' : '添加'}${
          modalType === 'mysql-external' ? 'MySQL 外部数据库' :
          modalType === 'postgresql-external' ? 'PostgreSQL 外部数据库' :
          'REST API 数据源'
        }`}
        open={modalVisible}
        footer={null}
        width={600}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        {getConfigForm()}
      </Modal>
    </div>
  );
}; 