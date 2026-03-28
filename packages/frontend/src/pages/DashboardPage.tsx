import React, { useState, useMemo } from 'react';
import { Row, Col, Typography, Button, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import FilterBar from '../components/FilterBar';
import SummaryCards from '../components/SummaryCards';
import ScoreTrendChart from '../components/ScoreTrendChart';
import ScoreDistributionChart from '../components/ScoreDistributionChart';
import WordCloud from '../components/WordCloud';
import RecentComments from '../components/RecentComments';
import { useApplications } from '../hooks/useApplications';
import { useSummary, useTrends, useDistribution, useWordCloud } from '../hooks/useAnalytics';
import { useFeedback } from '../hooks/useFeedback';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [appId, setAppId] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);

  const params = useMemo(
    () => ({
      applicationId: appId,
      startDate: dateRange[0],
      endDate: dateRange[1],
    }),
    [appId, dateRange],
  );

  const { data: apps, isLoading: appsLoading } = useApplications();
  const { data: summary, isLoading: summaryLoading } = useSummary(params);
  const { data: trends, isLoading: trendsLoading } = useTrends(params);
  const { data: distribution, isLoading: distLoading } = useDistribution(params);
  const { data: keywords, isLoading: keywordsLoading } = useWordCloud(params);
  const { data: feedbackPage, isLoading: feedbackLoading } = useFeedback({
    applicationId: appId,
    startDate: dateRange[0],
    endDate: dateRange[1],
    limit: 5,
    page: 1,
  });

  const appNames = useMemo(() => {
    const map: Record<string, string> = {};
    apps?.forEach((a) => {
      map[a.id] = a.name;
    });
    return map;
  }, [apps]);

  const handleReset = () => {
    setAppId(undefined);
    setDateRange([undefined, undefined]);
  };

  // Empty state — no responses at all
  if (!summaryLoading && summary?.totalResponses === 0) {
    return (
      <div>
        <Title level={3}>Dashboard</Title>
        <Empty
          description="No feedback collected yet. Create your first application to get started."
          style={{ marginTop: 64 }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/applications/new')}
          >
            Create First Application
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <Title level={3}>Dashboard</Title>

      <FilterBar
        applications={apps || []}
        selectedAppId={appId}
        onAppChange={setAppId}
        dateRange={dateRange}
        onDateChange={setDateRange}
        onReset={handleReset}
        onExport={() => navigate('/export')}
      />

      <SummaryCards data={summary} loading={summaryLoading || appsLoading} />

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <ScoreTrendChart data={trends} loading={trendsLoading} />
        </Col>
        <Col xs={24} lg={8}>
          <ScoreDistributionChart data={distribution} loading={distLoading} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <WordCloud data={keywords} loading={keywordsLoading} />
        </Col>
        <Col xs={24} lg={12}>
          <RecentComments
            data={feedbackPage?.data}
            loading={feedbackLoading}
            appNames={appNames}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
