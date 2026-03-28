import React, { useState } from 'react';
import { Typography, Select, Button, Space, App } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import GlassCard from '../components/GlassCard';
import FilterBar from '../components/FilterBar';
import { useApplications } from '../hooks/useApplications';
import { useFeedback } from '../hooks/useFeedback';

const { Title, Text } = Typography;

const ExportPage: React.FC = () => {
  const { message } = App.useApp();
  const [appId, setAppId] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);
  const [format, setFormat] = useState<'csv' | 'json'>('csv');

  const { data: apps } = useApplications();
  const { data: feedbackPage, isLoading } = useFeedback({
    applicationId: appId,
    startDate: dateRange[0],
    endDate: dateRange[1],
    limit: 10000,
    page: 1,
  });

  const handleReset = () => {
    setAppId(undefined);
    setDateRange([undefined, undefined]);
  };

  const handleDownload = () => {
    const items = feedbackPage?.data;
    if (!items?.length) {
      message.warning('No data to export');
      return;
    }

    let content: string;
    let mime: string;
    let ext: string;

    if (format === 'json') {
      content = JSON.stringify(items, null, 2);
      mime = 'application/json';
      ext = 'json';
    } else {
      const headers = ['id', 'applicationId', 'score', 'comment', 'sentiment', 'createdAt'];
      const rows = items.map((item) =>
        headers.map((h) => {
          const val = String(item[h as keyof typeof item] ?? '');
          return val.includes(',') || val.includes('"') || val.includes('\n')
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        }).join(','),
      );
      content = [headers.join(','), ...rows].join('\n');
      mime = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success(`Exported ${items.length} responses as ${ext.toUpperCase()}`);
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
            {feedbackPage?.total
              ? `${feedbackPage.total} responses available for export`
              : 'Select filters and click download'}
          </Text>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={isLoading}
            block
          >
            Download
          </Button>
        </Space>
      </GlassCard>
    </div>
  );
};

export default ExportPage;
