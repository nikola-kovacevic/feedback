import React from 'react';
import { Skeleton, Typography, Empty, theme } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import GlassCard from './GlassCard';
import ScoreTag from './ScoreTag';
import type { FeedbackResponse } from '../types';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

interface RecentCommentsProps {
  data: FeedbackResponse[] | undefined;
  loading: boolean;
  appNames?: Record<string, string>;
}

function scoreColor(score: number, token: ReturnType<typeof theme.useToken>['token']): string {
  if (score >= 9) return token.colorSuccess;
  if (score >= 7) return token.colorWarning;
  return token.colorError;
}

const RecentComments: React.FC<RecentCommentsProps> = ({ data, loading, appNames }) => {
  const { token } = theme.useToken();

  return (
    <GlassCard>
      <Title level={5} style={{ marginTop: 0 }}>Recent Comments</Title>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} title={false} />
      ) : !data?.length ? (
        <Empty description="No feedback yet" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map((item) => (
            <div
              key={item.id}
              style={{
                borderLeft: `3px solid ${scoreColor(item.score, token)}`,
                paddingLeft: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <ScoreTag score={item.score} />
                {appNames?.[item.applicationId] && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {appNames[item.applicationId]}
                  </Text>
                )}
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 'auto' }}>
                  {dayjs(item.createdAt).fromNow()}
                </Text>
              </div>
              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{ margin: 0, fontSize: 13 }}
              >
                {item.comment || 'No comment'}
              </Paragraph>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default RecentComments;
