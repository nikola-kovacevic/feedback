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
  const maxWeight = Math.max(...(data || []).map((d) => d.weight), 1);

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
            const normalizedWeight = item.weight / maxWeight;
            const fontSize = 12 + normalizedWeight * 14;
            return (
              <Tag
                key={item.term}
                color={PALETTE[idx % PALETTE.length]}
                style={{
                  fontSize,
                  padding: '4px 10px',
                  cursor: 'default',
                  borderColor: token.colorBorder,
                }}
              >
                {item.term}
              </Tag>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

export default WordCloud;
