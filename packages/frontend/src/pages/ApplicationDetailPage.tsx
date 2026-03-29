import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Descriptions,
  Button,
  Popconfirm,
  Skeleton,
  Space,
  App,
  theme,
  Input,
  InputNumber,
  Switch,
  Checkbox,
  Tag,
  List,
} from 'antd';
import { CopyOutlined, CheckOutlined, DeleteOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../components/GlassCard';
import EmbedSnippet from '../components/EmbedSnippet';
import { useApplication, useRegenerateKey, useDeleteApplication } from '../hooks/useApplications';
import client from '../api/client';
import type { ActionItem } from '../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const { data: app, isLoading } = useApplication(id);
  const regenerateKey = useRegenerateKey();
  const deleteApp = useDeleteApplication();
  const [keyCopied, setKeyCopied] = useState(false);
  const queryClient = useQueryClient();

  // --- Action Items ---
  const { data: actionItems = [] } = useQuery<ActionItem[]>({
    queryKey: ['action-items', id],
    queryFn: async () => {
      const { data } = await client.get(`/action-items`, { params: { applicationId: id } });
      return data;
    },
    enabled: !!id,
  });

  const createActionItem = useMutation({
    mutationFn: async (body: { applicationId: string; text: string; tag: string | null }) => {
      await client.post('/action-items', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items', id] });
      message.success('Action item created');
    },
  });

  const toggleActionItem = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
      await client.patch(`/action-items/${itemId}/complete`, { completed });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['action-items', id] }),
  });

  const deleteActionItem = useMutation({
    mutationFn: async (itemId: string) => {
      await client.delete(`/action-items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items', id] });
      message.success('Action item deleted');
    },
  });

  const [newItemText, setNewItemText] = useState('');
  const [newItemTag, setNewItemTag] = useState('');

  // --- Alert Config ---
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [alertSlackUrl, setAlertSlackUrl] = useState('');
  const [alertNpsThreshold, setAlertNpsThreshold] = useState<number>(50);

  useEffect(() => {
    if (app?.alertConfig) {
      setAlertEnabled(app.alertConfig.enabled);
      setAlertSlackUrl(app.alertConfig.slackUrl);
      setAlertNpsThreshold(app.alertConfig.npsThreshold);
    }
  }, [app]);

  const saveAlertConfig = useMutation({
    mutationFn: async () => {
      await client.patch(`/applications/${id}`, {
        alertConfig: {
          enabled: alertEnabled,
          slackUrl: alertSlackUrl,
          npsThreshold: alertNpsThreshold,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      message.success('Alert config saved');
    },
    onError: () => message.error('Failed to save alert config'),
  });

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

      {/* Action Items */}
      <GlassCard style={{ marginTop: 16 }}>
        <Title level={4} style={{ marginTop: 0 }}>Action Items</Title>
        <List
          dataSource={actionItems}
          locale={{ emptyText: 'No action items yet' }}
          renderItem={(item: ActionItem) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteActionItem.mutate(item.id)}
                />,
              ]}
            >
              <Space>
                <Checkbox
                  checked={item.completed}
                  onChange={(e) =>
                    toggleActionItem.mutate({ itemId: item.id, completed: e.target.checked })
                  }
                />
                <span style={{ textDecoration: item.completed ? 'line-through' : undefined }}>
                  {item.text}
                </span>
                {item.tag && <Tag color="blue">{item.tag}</Tag>}
              </Space>
            </List.Item>
          )}
        />
        <Space.Compact style={{ marginTop: 12, width: '100%' }}>
          <Input
            placeholder="New action item"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onPressEnter={() => {
              if (newItemText.trim() && id) {
                createActionItem.mutate({
                  applicationId: id,
                  text: newItemText.trim(),
                  tag: newItemTag.trim() || null,
                });
                setNewItemText('');
                setNewItemTag('');
              }
            }}
            style={{ flex: 1 }}
          />
          <Input
            placeholder="Tag (optional)"
            value={newItemTag}
            onChange={(e) => setNewItemTag(e.target.value)}
            style={{ width: 140 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={createActionItem.isPending}
            onClick={() => {
              if (newItemText.trim() && id) {
                createActionItem.mutate({
                  applicationId: id,
                  text: newItemText.trim(),
                  tag: newItemTag.trim() || null,
                });
                setNewItemText('');
                setNewItemTag('');
              }
            }}
          >
            Add
          </Button>
        </Space.Compact>
      </GlassCard>

      {/* NPS Alerts */}
      <GlassCard style={{ marginTop: 16 }}>
        <Title level={4} style={{ marginTop: 0 }}>NPS Alerts</Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Enabled:</span>
            <Switch checked={alertEnabled} onChange={setAlertEnabled} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Slack Webhook URL</label>
            <Input
              placeholder="https://hooks.slack.com/services/..."
              value={alertSlackUrl}
              onChange={(e) => setAlertSlackUrl(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>NPS Threshold (0-100)</label>
            <InputNumber
              min={0}
              max={100}
              value={alertNpsThreshold}
              onChange={(val) => setAlertNpsThreshold(val ?? 50)}
              style={{ width: 120 }}
            />
          </div>
          <Button
            type="primary"
            loading={saveAlertConfig.isPending}
            onClick={() => saveAlertConfig.mutate()}
          >
            Save Alert Config
          </Button>
        </Space>
      </GlassCard>

      {/* Weekly Digest */}
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>Weekly Digest</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              A shareable summary of this week's scores, tags, and completed actions.
            </Text>
          </div>
          <Space>
            <Button
              onClick={async () => {
                try {
                  const res = await client.get(`/digest/${id}/latest`, { responseType: 'blob' });
                  const blob = new Blob([res.data], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                } catch {
                  message.error('Failed to load digest');
                }
              }}
            >
              View Digest
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                try {
                  await client.post(`/digest/${id}/generate`);
                  message.success('Digest generated');
                } catch {
                  message.error('Failed to generate digest');
                }
              }}
            >
              Generate Now
            </Button>
          </Space>
        </div>
      </GlassCard>
    </div>
  );
};

export default ApplicationDetailPage;
