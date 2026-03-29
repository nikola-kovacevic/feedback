import React from 'react';
import { Typography, Skeleton, Empty, theme } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import GlassCard from './GlassCard';
import type { ComparisonItem, Application } from '../types';

const { Title, Text } = Typography;

interface TopPerformersProps {
  data: ComparisonItem[] | undefined;
  applications?: Application[];
  loading: boolean;
}

function getMedal(index: number): string {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return `#${index + 1}`;
}

function getNpsColor(avg: number): string {
  if (avg >= 8) return '#2D733E';
  if (avg >= 6) return '#3B82F6';
  if (avg >= 4) return '#F2BB77';
  return '#D93A2B';
}

const TopPerformers: React.FC<TopPerformersProps> = ({ data, applications, loading }) => {
  const { token } = theme.useToken();
  const sorted = [...(data || [])].sort((a, b) => b.averageScore - a.averageScore);

  const appMap = new Map<string, Application>();
  (applications || []).forEach(a => appMap.set(a.id, a));

  return (
    <GlassCard style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TrophyOutlined style={{ fontSize: 18, color: '#0eb4a1' }} />
        <Title level={5} style={{ margin: 0 }}>Top Performers</Title>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} title={false} />
      ) : !sorted.length ? (
        <Empty description="Register apps and collect feedback to see rankings" />
      ) : (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {sorted.map((item, idx) => {
            const app = appMap.get(item.applicationId);
            const icon = app?.icon;
            const appUrl = app?.appUrl;

            return (
              <div
                key={item.applicationId}
                style={{
                  flex: '0 0 auto',
                  minWidth: 180,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: idx === 0
                    ? 'linear-gradient(135deg, rgba(14,180,161,0.12), rgba(45,115,62,0.08))'
                    : token.colorBgContainer,
                  border: `1px solid ${idx === 0 ? 'rgba(14,180,161,0.3)' : token.colorBorder}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{getMedal(idx)}</span>
                    {icon ? (
                      <img src={icon} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: 24, height: 24, borderRadius: 4,
                        background: '#3B82F6', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {item.applicationName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 24, fontWeight: 700, color: getNpsColor(item.averageScore) }}>
                    {item.averageScore.toFixed(1)}
                  </span>
                </div>
                {appUrl ? (
                  <a
                    href={appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.applicationName}
                  </a>
                ) : (
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>{item.applicationName}</Text>
                )}
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.totalResponses} response{item.totalResponses !== 1 ? 's' : ''}
                </Text>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

export default TopPerformers;
