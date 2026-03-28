import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Descriptions, Button, Popconfirm, Skeleton, Space, App, theme } from 'antd';
import { CopyOutlined, CheckOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import GlassCard from '../components/GlassCard';
import EmbedSnippet from '../components/EmbedSnippet';
import { useApplication, useRegenerateKey, useDeleteApplication } from '../hooks/useApplications';
import dayjs from 'dayjs';

const { Title } = Typography;

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const { data: app, isLoading } = useApplication(id);
  const regenerateKey = useRegenerateKey();
  const deleteApp = useDeleteApplication();
  const [keyCopied, setKeyCopied] = useState(false);

  const handleCopyKey = async () => {
    if (!app) return;
    try {
      await navigator.clipboard.writeText(app.apiKey);
      setKeyCopied(true);
      message.success('API key copied');
      setTimeout(() => setKeyCopied(false), 2000);
    } catch {
      message.error('Failed to copy');
    }
  };

  const handleRegenerate = async () => {
    if (!id) return;
    try {
      await regenerateKey.mutateAsync(id);
      message.success('API key regenerated');
    } catch {
      message.error('Failed to regenerate key');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteApp.mutateAsync(id);
      message.success('Application deleted');
      navigate('/applications');
    } catch {
      message.error('Failed to delete application');
    }
  };

  if (isLoading) {
    return (
      <div>
        <Title level={3}>Application Details</Title>
        <GlassCard>
          <Skeleton active paragraph={{ rows: 8 }} />
        </GlassCard>
      </div>
    );
  }

  if (!app) {
    return (
      <div>
        <Title level={3}>Application Not Found</Title>
        <Button onClick={() => navigate('/applications')}>Back to Applications</Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>{app.name}</Title>
        <Space>
          <Popconfirm
            title="Regenerate API key?"
            description="The current key will stop working immediately."
            onConfirm={handleRegenerate}
            okText="Regenerate"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<ReloadOutlined />} loading={regenerateKey.isPending}>
              Regenerate Key
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Delete this application?"
            description="This action cannot be undone. All feedback data will be lost."
            onConfirm={handleDelete}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleteApp.isPending}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <GlassCard style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item label="Name">{app.name}</Descriptions.Item>
          <Descriptions.Item label="Description">{app.description || '—'}</Descriptions.Item>
          <Descriptions.Item label="Created">{dayjs(app.createdAt).format('MMM D, YYYY h:mm A')}</Descriptions.Item>
          <Descriptions.Item label="Updated">{dayjs(app.updatedAt).format('MMM D, YYYY h:mm A')}</Descriptions.Item>
          <Descriptions.Item label="API Key" span={2}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code
                style={{
                  background: token.colorBgLayout,
                  padding: '4px 8px',
                  borderRadius: token.borderRadius,
                  fontSize: 13,
                  wordBreak: 'break-all',
                }}
              >
                {app.apiKey}
              </code>
              <Button
                size="small"
                icon={keyCopied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopyKey}
              />
            </div>
          </Descriptions.Item>
        </Descriptions>
      </GlassCard>

      <GlassCard>
        <EmbedSnippet apiKey={app.apiKey} mode={app.widgetConfig?.mode} />
      </GlassCard>
    </div>
  );
};

export default ApplicationDetailPage;
