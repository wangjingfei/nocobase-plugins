import React from 'react';
import { Table, Button, Space, message } from 'antd';
import { useDataSource } from './DataSourceProvider';
import { useAPIClient } from '@nocobase/client';

export const DataSourceList: React.FC = () => {
  const { dataSources, loading, refresh } = useDataSource();
  const api = useAPIClient();

  const handleDelete = async (id: string) => {
    try {
      await api.request({
        url: `dataSources/${id}`,
        method: 'delete',
      });
      message.success('数据源删除成功');
      refresh();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            删除
          </Button>
          <Button type="link" onClick={() => {}}>
            编辑
          </Button>
          <Button type="link" onClick={() => {}}>
            同步
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => {}}>
          添加数据源
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSources}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
}; 