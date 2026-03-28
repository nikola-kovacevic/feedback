import React from 'react';
import { Row, Col, Typography, Button, Empty, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import GlassCard from '../components/GlassCard';
import { useApplications } from '../hooks/useApplications';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: apps, isLoading } = useApplications();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Applications</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/applications/new')}
        >
          Register New App
        </Button>
      </div>

      {isLoading ? (
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map((i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <GlassCard>
                <Skeleton active />
              </GlassCard>
            </Col>
          ))}
        </Row>
      ) : !apps?.length ? (
        <Empty description="No applications registered yet">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/applications/new')}
          >
            Register Your First App
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {apps.map((app) => (
            <Col xs={24} sm={12} lg={8} key={app.id}>
              <GlassCard
                style={{ cursor: 'pointer' }}
                className="app-card"
              >
                <div onClick={() => navigate(`/applications/${app.id}`)}>
                  <Title level={5} style={{ marginTop: 0 }}>{app.name}</Title>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    type="secondary"
                    style={{ marginBottom: 8 }}
                  >
                    {app.description || 'No description'}
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Created {dayjs(app.createdAt).format('MMM D, YYYY')}
                  </Text>
                </div>
              </GlassCard>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ApplicationsPage;
