import React, { useState, useMemo } from 'react';
import { Typography, Table, Tag, Button, App, Popover, Input, Space } from 'antd';
import { CheckOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import FilterBar from '../components/FilterBar';
import ScoreTag from '../components/ScoreTag';
import { useApplications } from '../hooks/useApplications';
import { useFeedback } from '../hooks/useFeedback';
import client from '../api/client';
import type { FeedbackResponse } from '../types';

const { Title, Paragraph, Text } = Typography;

const PAGE_SIZE = 20;

const ResponsesPage: React.FC = () => {
  const [appId, setAppId] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);
  const [page, setPage] = useState(1);

  const { data: apps } = useApplications();
  const { data: feedbackPage, isLoading } = useFeedback({
    applicationId: appId,
    startDate: dateRange[0],
    endDate: dateRange[1],
    page,
    limit: PAGE_SIZE,
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
    setPage(1);
  };

  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const resolveMutation = useMutation({
    mutationFn: async ({ id, resolve }: { id: string; resolve: boolean }) => {
      const endpoint = resolve ? `/feedback/${id}/resolve` : `/feedback/${id}/unresolve`;
      await client.patch(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      message.success('Feedback updated');
    },
  });

  const tagMutation = useMutation({
    mutationFn: async ({ id, tags }: { id: string; tags: string[] }) => {
      await client.patch(`/feedback/${id}/tags`, { tags });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      message.success('Tags updated');
    },
  });

  const [tagInputValue, setTagInputValue] = useState('');
  const [tagPopoverOpen, setTagPopoverOpen] = useState<string | null>(null);

  const columns: ColumnsType<FeedbackResponse> = [
    {
      title: 'Application',
      dataIndex: 'applicationId',
      key: 'app',
      render: (id: string) => appNames[id] || id,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score: number) => <ScoreTag score={score} />,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (text: string) => text || <Text type="secondary">—</Text>,
    },
    {
      title: 'Sentiment',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: 100,
      render: (s: string) => {
        const colorMap: Record<string, string> = {
          positive: 'green',
          neutral: 'default',
          negative: 'red',
        };
        return <Tag color={colorMap[s] || 'default'}>{s}</Tag>;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[] | undefined, record: FeedbackResponse) => {
        const currentTags = tags || [];
        return (
          <Space size={[4, 4]} wrap>
            {currentTags.map((tag) => (
              <Tag
                key={tag}
                color="blue"
                closable
                onClose={(e) => {
                  e.preventDefault();
                  tagMutation.mutate({
                    id: record.id,
                    tags: currentTags.filter((t) => t !== tag),
                  });
                }}
              >
                {tag}
              </Tag>
            ))}
            <Popover
              open={tagPopoverOpen === record.id}
              onOpenChange={(open) => {
                setTagPopoverOpen(open ? record.id : null);
                if (!open) setTagInputValue('');
              }}
              trigger="click"
              content={
                <Space.Compact>
                  <Input
                    size="small"
                    placeholder="New tag"
                    value={tagInputValue}
                    onChange={(e) => setTagInputValue(e.target.value)}
                    onPressEnter={() => {
                      const val = tagInputValue.trim();
                      if (val && !currentTags.includes(val)) {
                        tagMutation.mutate({ id: record.id, tags: [...currentTags, val] });
                      }
                      setTagInputValue('');
                      setTagPopoverOpen(null);
                    }}
                    style={{ width: 120 }}
                  />
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      const val = tagInputValue.trim();
                      if (val && !currentTags.includes(val)) {
                        tagMutation.mutate({ id: record.id, tags: [...currentTags, val] });
                      }
                      setTagInputValue('');
                      setTagPopoverOpen(null);
                    }}
                  >
                    Add
                  </Button>
                </Space.Compact>
              }
            >
              <Tag
                style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                onClick={(e) => e.stopPropagation()}
              >
                <PlusOutlined /> Add Tag
              </Tag>
            </Popover>
          </Space>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'resolved',
      key: 'status',
      width: 120,
      render: (resolved: boolean, record: FeedbackResponse) => (
        <Button
          size="small"
          type={resolved ? 'default' : 'primary'}
          icon={resolved ? <UndoOutlined /> : <CheckOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            resolveMutation.mutate({ id: record.id, resolve: !resolved });
          }}
        >
          {resolved ? 'Reopen' : 'Resolve'}
        </Button>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      width: 160,
      render: (d: string) => dayjs(d).format('MMM D, YYYY h:mm A'),
    },
  ];

  return (
    <div>
      <Title level={3}>Responses</Title>

      <FilterBar
        applications={apps || []}
        selectedAppId={appId}
        onAppChange={(val) => {
          setAppId(val);
          setPage(1);
        }}
        dateRange={dateRange}
        onDateChange={(range) => {
          setDateRange(range);
          setPage(1);
        }}
        onReset={handleReset}
      />

      <Table<FeedbackResponse>
        dataSource={feedbackPage?.items}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: feedbackPage?.total || 0,
          onChange: setPage,
          showSizeChanger: false,
          showTotal: (total) => `${total} responses`,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: '8px 0' }}>
              <Paragraph style={{ margin: 0 }}>
                <Text strong>Full Comment:</Text> {record.comment || 'No comment'}
              </Paragraph>
              {record.userMetadata && Object.keys(record.userMetadata).length > 0 && (
                <Paragraph style={{ margin: '8px 0 0' }}>
                  <Text strong>Metadata:</Text>{' '}
                  <code>{JSON.stringify(record.userMetadata, null, 2)}</code>
                </Paragraph>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default ResponsesPage;
