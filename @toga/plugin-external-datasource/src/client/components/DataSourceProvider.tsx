import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAPIClient } from '@nocobase/client';

interface DataSourceContextType {
  dataSources: any[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataSourceContext = createContext<DataSourceContextType>({
  dataSources: [],
  loading: false,
  refresh: async () => {},
});

export const useDataSource = () => useContext(DataSourceContext);

export const DataSourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useAPIClient();
  const [dataSources, setDataSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDataSources = async () => {
    setLoading(true);
    try {
      const response = await api.request({
        url: 'dataSources',
        method: 'get',
      });
      setDataSources(response.data);
    } catch (error) {
      console.error('Failed to load data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataSources();
  }, []);

  return (
    <DataSourceContext.Provider
      value={{
        dataSources,
        loading,
        refresh: loadDataSources,
      }}
    >
      {children}
    </DataSourceContext.Provider>
  );
}; 