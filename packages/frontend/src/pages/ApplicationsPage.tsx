import React from 'react';
import { Row, Col, Typography, Button, Empty, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, LinkOutlined } from '@ant-design/icons';
import GlassCard from '../components/GlassCard';
import { useApplications } from '../hooks/useApplications';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const AppIcon: React.FC<{ icon?: string | null; name: string }> = ({ icon, name }) => {
  if (icon) {
    return (
      <img
        src={icon}
        alt={name}
        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  const colors = ['#354B8C', '#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: colors[colorIndex],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 600,
        fontSize: 18,
        flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <AppIcon icon={app.icon} name={app.name} />
                    <div style={{ minWidth: 0 }}>
                      {app.appUrl ? (
                        <Title
                          level={5}
                          style={{ marginTop: 0, marginBottom: 0 }}
                        >
                          <a
                            href={app.appUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {app.name}
                          </a>
                        </Title>
                      ) : (
                        <Title level={5} style={{ marginTop: 0, marginBottom: 0 }}>{app.name}</Title>
                      )}
                    </div>
                  </div>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    type="secondary"
                    style={{ marginBottom: 8 }}
                  >
                    {app.description || 'No description'}
                  </Paragraph>
                  {app.appUrl && (
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                      <LinkOutlined style={{ marginRight: 4 }} />
                      {app.appUrl}
                    </Text>
                  )}
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
