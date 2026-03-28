import React, { useState } from 'react';
import { Typography, Select, Button, Space, App } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import GlassCard from '../components/GlassCard';
import FilterBar from '../components/FilterBar';
import { useApplications } from '../hooks/useApplications';
import client from '../api/client';

const { Title, Text } = Typography;

const ExportPage: React.FC = () => {
  const { message } = App.useApp();
  const [appId, setAppId] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [downloading, setDownloading] = useState(false);

  const { data: apps } = useApplications();

  const handleReset = () => {
    setAppId(undefined);
    setDateRange([undefined, undefined]);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const params: Record<string, string> = { format };
      if (appId) params.applicationId = appId;
      if (dateRange[0]) params.dateFrom = dateRange[0];
      if (dateRange[1]) params.dateTo = dateRange[1];

      const res = await client.get('/feedback/export', {
        params,
        responseType: format === 'csv' ? 'blob' : 'json',
      });

      let blob: Blob;
      let ext: string;

      if (format === 'csv') {
        blob = new Blob([res.data], { type: 'text/csv' });
        ext = 'csv';
      } else {
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length === 0) {
          message.warning('No data to export');
          setDownloading(false);
          return;
        }
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        ext = 'json';
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-export.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success(`Export downloaded as ${ext.toUpperCase()}`);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        message.error('Session expired. Please log in again.');
      } else {
        message.error('Export failed. Please try again.');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <Title level={3}>Export Data</Title>

      <FilterBar
        applications={apps || []}
        selectedAppId={appId}
        onAppChange={setAppId}
        dateRange={dateRange}
        onDateChange={setDateRange}
        onReset={handleReset}
      />

      <GlassCard style={{ maxWidth: 480 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Export Format</Text>
            <Select
              value={format}
              onChange={setFormat}
              style={{ width: '100%' }}
              options={[
                { label: 'CSV', value: 'csv' },
                { label: 'JSON', value: 'json' },
              ]}
            />
          </div>

          <Text type="secondary">
            Select filters and format, then click download.
          </Text>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={downloading}
            block
          >
            Download Export
          </Button>
        </Space>
      </GlassCard>
    </div>
  );
};

export default ExportPage;
