import React from 'react';
import { Row, Col, Typography, Skeleton, theme } from 'antd';
import GlassCard from './GlassCard';
import type { AnalyticsSummary } from '../types';

const { Title, Text } = Typography;

interface SummaryCardsProps {
  data: AnalyticsSummary | undefined;
  loading: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data, loading }) => {
  const { token } = theme.useToken();

  const cards = [
    {
      label: 'Average Score',
      value: data?.averageScore?.toFixed(1) ?? '—',
      color: token.colorSuccess,
    },
    {
      label: 'NPS Score',
      value: data?.npsScore !== undefined ? `${data.npsScore}` : '—',
      color: token.colorPrimary,
    },
    {
      label: 'Total Responses',
      value: data?.totalResponses?.toLocaleString() ?? '—',
      color: token.colorTextSecondary,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card) => (
        <Col xs={24} sm={8} key={card.label}>
          <GlassCard>
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            ) : (
              <>
                <Text type="secondary">{card.label}</Text>
                <Title level={2} style={{ margin: '8px 0 0', color: card.color }}>
                  {card.value}
                </Title>
              </>
            )}
          </GlassCard>
        </Col>
      ))}
    </Row>
  );
};

export default SummaryCards;
