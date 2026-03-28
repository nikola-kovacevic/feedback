import React from 'react';
import { Skeleton, Typography, theme } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import GlassCard from './GlassCard';
import type { TrendPoint } from '../types';

const { Title } = Typography;

interface ScoreTrendChartProps {
  data: TrendPoint[] | undefined;
  loading: boolean;
}

const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ data, loading }) => {
  const { token } = theme.useToken();

  return (
    <GlassCard>
      <Title level={5} style={{ marginTop: 0 }}>Score Trend</Title>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} title={false} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
            <XAxis
              dataKey="date"
              tickFormatter={(val: string) => dayjs(val).format('MMM D')}
              stroke={token.colorTextSecondary}
              fontSize={12}
            />
            <YAxis
              domain={[0, 10]}
              stroke={token.colorTextSecondary}
              fontSize={12}
            />
            <Tooltip
              labelFormatter={(val) => dayjs(String(val)).format('MMM D, YYYY')}
              contentStyle={{
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorder}`,
                borderRadius: token.borderRadius,
              }}
            />
            <Bar
              dataKey="averageScore"
              fill={token.colorPrimary}
              radius={[4, 4, 0, 0]}
              name="Avg Score"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
};

export default ScoreTrendChart;
