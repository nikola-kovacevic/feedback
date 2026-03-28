import React from 'react';
import { Typography, Table, Skeleton } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { theme } from 'antd';
import GlassCard from '../components/GlassCard';
import { useComparison } from '../hooks/useAnalytics';
import type { ComparisonItem } from '../types';

const { Title } = Typography;

const ComparisonPage: React.FC = () => {
  const { token } = theme.useToken();
  const { data, isLoading } = useComparison();

  const columns: ColumnsType<ComparisonItem> = [
    {
      title: 'Application',
      dataIndex: 'applicationName',
      key: 'name',
    },
    {
      title: 'Avg Score',
      dataIndex: 'averageScore',
      key: 'avg',
      render: (v: number) => v?.toFixed(1) ?? '—',
      sorter: (a, b) => a.averageScore - b.averageScore,
    },
    {
      title: 'NPS',
      dataIndex: 'npsScore',
      key: 'nps',
      sorter: (a, b) => a.npsScore - b.npsScore,
    },
    {
      title: 'Responses',
      dataIndex: 'totalResponses',
      key: 'responses',
      render: (v: number) => v?.toLocaleString() ?? '0',
      sorter: (a, b) => a.totalResponses - b.totalResponses,
    },
  ];

  return (
    <div>
      <Title level={3}>Application Comparison</Title>

      <GlassCard style={{ marginBottom: 16 }}>
        <Title level={5} style={{ marginTop: 0 }}>Score Comparison</Title>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} title={false} />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
              <XAxis
                dataKey="applicationName"
                stroke={token.colorTextSecondary}
                fontSize={12}
              />
              <YAxis stroke={token.colorTextSecondary} fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: token.borderRadius,
                }}
              />
              <Legend />
              <Bar dataKey="averageScore" fill={token.colorPrimary} name="Avg Score" radius={[4, 4, 0, 0]} />
              <Bar dataKey="npsScore" fill={token.colorSuccess} name="NPS" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      <GlassCard>
        <Title level={5} style={{ marginTop: 0 }}>Summary</Title>
        <Table<ComparisonItem>
          dataSource={data}
          columns={columns}
          rowKey="applicationId"
          loading={isLoading}
          pagination={false}
        />
      </GlassCard>
    </div>
  );
};

export default ComparisonPage;
