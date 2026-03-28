import React from 'react';
import { Tag, Skeleton, Typography, Empty, theme } from 'antd';
import GlassCard from './GlassCard';
import type { KeywordItem } from '../types';

const { Title } = Typography;

interface WordCloudProps {
  data: KeywordItem[] | undefined;
  loading: boolean;
}

const PALETTE = [
  'blue',
  'green',
  'purple',
  'magenta',
  'cyan',
  'orange',
  'geekblue',
  'volcano',
  'gold',
  'lime',
];

const WordCloud: React.FC<WordCloudProps> = ({ data, loading }) => {
  const { token } = theme.useToken();
  const maxCount = Math.max(...(data || []).map((d) => d.count), 1);

  return (
    <GlassCard>
      <Title level={5} style={{ marginTop: 0 }}>Keywords</Title>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} title={false} />
      ) : !data?.length ? (
        <Empty description="No keywords yet" />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {data.map((item, idx) => {
            const weight = item.count / maxCount;
            const fontSize = 12 + weight * 14;
            return (
              <Tag
                key={item.keyword}
                color={PALETTE[idx % PALETTE.length]}
                style={{
                  fontSize,
                  padding: '4px 10px',
                  cursor: 'default',
                  borderColor: token.colorBorder,
                }}
              >
                {item.keyword} ({item.count})
              </Tag>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

export default WordCloud;
