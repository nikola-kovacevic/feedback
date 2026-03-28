import React from 'react';
import { Skeleton, Typography, theme } from 'antd';
import GlassCard from './GlassCard';
import type { DistributionItem } from '../types';

const { Title, Text } = Typography;

interface ScoreDistributionChartProps {
  data: DistributionItem[] | undefined;
  loading: boolean;
}

function getNpsColor(score: number, token: ReturnType<typeof theme.useToken>['token']): string {
  if (score >= 9) return token.colorSuccess;
  if (score >= 7) return token.colorWarning;
  return token.colorError;
}

const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data, loading }) => {
  const { token } = theme.useToken();

  // CRITICAL: use spread to avoid mutating React Query cache
  const reversed = [...(data || [])].reverse();
  const maxCount = Math.max(...reversed.map((d) => d.count), 1);

  return (
    <GlassCard>
      <Title level={5} style={{ marginTop: 0 }}>Score Distribution</Title>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} title={false} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {reversed.map((item) => (
            <div
              key={item.score}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Text
                style={{ width: 24, textAlign: 'right', fontSize: 13, flexShrink: 0 }}
              >
                {item.score}
              </Text>
              <div
                style={{
                  flex: 1,
                  background: token.colorBgLayout,
                  borderRadius: 4,
                  height: 20,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    height: '100%',
                    background: getNpsColor(item.score, token),
                    borderRadius: 4,
                    transition: 'width 0.3s ease',
                    minWidth: item.count > 0 ? 4 : 0,
                  }}
                />
              </div>
              <Text style={{ width: 40, fontSize: 12, flexShrink: 0 }}>
                {item.count}
              </Text>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default ScoreDistributionChart;
