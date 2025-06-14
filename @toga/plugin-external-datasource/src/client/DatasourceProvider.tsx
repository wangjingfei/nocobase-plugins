import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAPIClient } from '@nocobase/client';

interface DataSourceContextType {
  dataSources: any[];
  loading: boolean;
  refresh: () => void;
}

const DataSourceContext = createContext<DataSourceContextType>({
  dataSources: [],
  loading: false,
  refresh: () => {},
});

export const useDatasources = () => useContext(DataSourceContext);

export const DatasourceProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const api = useAPIClient();
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDataSources = async () => {
    setLoading(true);
    try {
      const response = await api.resource('external-datasources').list();
      setDataSources(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch datasources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSources();
  }, []);

  return (
    <DataSourceContext.Provider
      value={{
        dataSources,
        loading,
        refresh: fetchDataSources,
      }}
    >
      {children}
    </DataSourceContext.Provider>
  );
}; 