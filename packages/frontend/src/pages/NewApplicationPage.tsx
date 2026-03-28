import React from 'react';
import { Typography, Form, Input, Select, Switch, InputNumber, Button, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { useCreateApplication } from '../hooks/useApplications';
import type { WidgetConfig } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

interface FormValues {
  name: string;
  description: string;
  mode: string;
  question: string;
  commentRequired: boolean;
  themeColor: string;
  cooldownHours: number;
  position: string;
}

const NewApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const createApp = useCreateApplication();
  const [form] = Form.useForm<FormValues>();

  const handleFinish = async (values: FormValues) => {
    try {
      const app = await createApp.mutateAsync({
        name: values.name,
        description: values.description,
        widgetConfig: {
          mode: values.mode as 'floating' | 'inline',
          question: values.question || 'How would you rate your experience?',
          commentRequired: values.commentRequired ?? true,
          themeColor: values.themeColor || '#354B8C',
          cooldownHours: values.cooldownHours ?? 24,
          position: (values.position || 'bottom-right') as WidgetConfig['position'],
        },
      });
      message.success('Application created successfully');
      navigate(`/applications/${app.id}`);
    } catch {
      message.error('Failed to create application');
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Title level={3}>Register New Application</Title>
      <GlassCard>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            mode: 'floating',
            commentRequired: true,
            cooldownHours: 24,
            position: 'bottom-right',
            themeColor: '#354B8C',
            question: 'How would you rate your experience?',
          }}
        >
          <Form.Item
            name="name"
            label="Application Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="My App" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Brief description of this application" />
          </Form.Item>

          <Form.Item name="mode" label="Widget Mode">
            <Select
              options={[
                { label: 'Floating Button', value: 'floating' },
                { label: 'Inline Embed', value: 'inline' },
              ]}
            />
          </Form.Item>

          <Form.Item name="question" label="Feedback Question">
            <Input placeholder="How likely are you to recommend us?" />
          </Form.Item>

          <Form.Item name="commentRequired" label="Require Comment" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="themeColor" label="Theme Color">
            <Input type="color" style={{ width: 80, height: 36, padding: 2 }} />
          </Form.Item>

          <Form.Item name="cooldownHours" label="Cooldown (hours)">
            <InputNumber min={0} max={720} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="position" label="Widget Position">
            <Select
              options={[
                { label: 'Bottom Right', value: 'bottom-right' },
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Top Right', value: 'top-right' },
                { label: 'Top Left', value: 'top-left' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createApp.isPending}
              block
            >
              Create Application
            </Button>
          </Form.Item>
        </Form>
      </GlassCard>
    </div>
  );
};

export default NewApplicationPage;
