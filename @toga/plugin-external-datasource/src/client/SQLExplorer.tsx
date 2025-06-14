import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Input,
  Table,
  Tabs,
  message,
  Spin,
  Select,
  Space,
  Divider,
  Typography,
} from 'antd';
import {
  PlayCircleOutlined,
  SaveOutlined,
  DatabaseOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useAPIClient, useRequest } from '@nocobase/client';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title } = Typography;

export const SQLExplorer = () => {
  const { t } = useTranslation('external-datasource');
  const { id } = useParams<{ id: string }>();
  const api = useAPIClient();
  const [sql, setSql] = useState('');
  const [executing, setExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState('results');
  const [queryResults, setQueryResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableStructure, setTableStructure] = useState<any[]>([]);

  // 获取数据源详情
  const { data: datasource, loading: dsLoading } = useRequest({
    url: `external-datasources/${id}`,
    method: 'get',
  });

  // 获取表列表
  const { data: tablesData, loading: tablesLoading, refresh: refreshTables } = useRequest({
    url: `external-datasources/${id}/getTables`,
    method: 'get',
  });

  // 当选择表时，获取表结构
  useEffect(() => {
    if (selectedTable) {
      fetchTableStructure(selectedTable);
    }
  }, [selectedTable]);

  // 获取表结构
  const fetchTableStructure = async (tableName: string) => {
    try {
      const response = await api.request({
        url: `external-datasources/${id}/getTableStructure`,
        method: 'get',
        params: { tableName },
      });
      setTableStructure(response.data?.data || []);
    } catch (error) {
      message.error(t('Failed to get table structure'));
    }
  };

  // 执行SQL查询
  const executeQuery = async () => {
    if (!sql.trim()) {
      message.warning(t('Please enter SQL query'));
      return;
    }

    setExecuting(true);
    setError(null);
    setActiveTab('results');

    try {
      const response = await api.request({
        url: `external-datasources/${id}/executeQuery`,
        method: 'post',
        data: { sql },
      });

      const { results, metadata } = response.data?.data || {};
      setQueryResults(results);
    } catch (error) {
      setError(error.response?.data?.message || t('Query execution failed'));
      message.error(error.response?.data?.message || t('Query execution failed'));
    } finally {
      setExecuting(false);
    }
  };

  // 生成查询表内容的SQL
  const generateSelectQuery = (tableName: string) => {
    setSql(`SELECT * FROM ${tableName} LIMIT 100;`);
  };

  // 构建表结构列
  const tableStructureColumns = [
    {
      title: t('Column Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Data Type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('Nullable'),
      dataIndex: 'nullable',
      key: 'nullable',
      render: (nullable: boolean) => (nullable ? 'YES' : 'NO'),
    },
    {
      title: t('Default'),
      dataIndex: 'default',
      key: 'default',
      render: (defaultValue: any) => defaultValue || '-',
    },
  ];

  // 动态构建结果列
  const getResultColumns = () => {
    if (!queryResults || !queryResults.length) return [];
    
    return Object.keys(queryResults[0]).map(key => ({
      title: key,
      dataIndex: key,
      key,
      render: (text: any) => {
        if (text === null || text === undefined) return <span style={{ color: '#999' }}>NULL</span>;
        if (typeof text === 'object') return JSON.stringify(text);
        return String(text);
      },
    }));
  };

  return (
    <Card loading={dsLoading}>
      <Title level={4}>
        {t('SQL Explorer')} - {datasource?.data?.name}
      </Title>
      <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
        <div style={{ width: 250, borderRight: '1px solid #f0f0f0', paddingRight: 16, overflow: 'auto' }}>
          <Title level={5} style={{ display: 'flex', alignItems: 'center' }}>
            <DatabaseOutlined style={{ marginRight: 8 }} />
            {t('Tables')}
          </Title>
          <Spin spinning={tablesLoading}>
            <Select
              style={{ width: '100%', marginBottom: 16 }}
              placeholder={t('Select a table')}
              onChange={setSelectedTable}
              value={selectedTable}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {tablesData?.data?.map((table: string) => (
                <Select.Option key={table} value={table}>
                  {table}
                </Select.Option>
              ))}
            </Select>

            {selectedTable && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <Button 
                    type="link" 
                    icon={<PlayCircleOutlined />}
                    onClick={() => generateSelectQuery(selectedTable)}
                  >
                    {t('Query Data')}
                  </Button>
                </div>
                
                <Title level={5} style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
                  <TableOutlined style={{ marginRight: 8 }} />
                  {t('Columns')}
                </Title>
                
                <Table
                  size="small"
                  columns={[
                    {
                      title: t('Name'),
                      dataIndex: 'name',
                      key: 'name',
                    },
                    {
                      title: t('Type'),
                      dataIndex: 'type',
                      key: 'type',
                    },
                  ]}
                  dataSource={tableStructure}
                  pagination={false}
                  scroll={{ y: 300 }}
                  rowKey="name"
                />
              </>
            )}
          </Spin>
        </div>
        
        <div style={{ flex: 1, paddingLeft: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 16 }}>
            <TextArea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder={t('Enter your SQL query here...')}
              autoSize={{ minRows: 5, maxRows: 10 }}
            />
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={executeQuery}
                loading={executing}
              >
                {t('Execute')}
              </Button>
            </div>
          </div>
          
          <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ flex: 1 }}>
            <TabPane tab={t('Results')} key="results">
              {executing ? (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <Spin tip={t('Executing query...')} />
                </div>
              ) : error ? (
                <div style={{ color: 'red', padding: 16, backgroundColor: '#fff2f0', borderRadius: 4 }}>
                  {error}
                </div>
              ) : queryResults ? (
                <Table
                  columns={getResultColumns()}
                  dataSource={queryResults}
                  scroll={{ x: 'max-content' }}
                  pagination={{ pageSize: 50 }}
                  size="small"
                  rowKey={(record, index) => index as number}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: 32 }}>
                  {t('Execute a query to see results')}
                </div>
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Card>
  );
}; 