import React, { useState } from 'react';
import { Typography, Descriptions, Skeleton, Form, Input, Button, Divider, App } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import client from '../api/client';
import dayjs from 'dayjs';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { mode } = useTheme();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (values: { currentPassword: string; newPassword: string }) => {
    setChangingPassword(true);
    try {
      await client.post('/auth/change-password', values);
      message.success('Password changed successfully');
      form.resetFields();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to change password';
      message.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Title level={3}>Settings</Title>

      <GlassCard>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Descriptions
            column={1}
            bordered
            title="User Profile"
            labelStyle={{ fontWeight: 500, width: 140 }}
          >
            <Descriptions.Item label="Name">{user?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Role">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Member Since">
              {user?.createdAt ? dayjs(user.createdAt).format('MMM D, YYYY') : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Theme Mode">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </GlassCard>

      <div style={{ marginTop: 24 }}>
        <GlassCard>
          <Title level={5} style={{ marginTop: 0 }}>
            <LockOutlined style={{ marginRight: 8 }} />
            Change Password
          </Title>
          <Divider style={{ margin: '12px 0 16px' }} />
          <Form
            form={form}
            layout="vertical"
            onFinish={handleChangePassword}
            requiredMark={false}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Enter your current password' }]}
            >
              <Input.Password aria-label="Current password" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Enter a new password' },
                { min: 8, message: 'Password must be at least 8 characters' },
              ]}
            >
              <Input.Password aria-label="New password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password aria-label="Confirm new password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={changingPassword}
                icon={<LockOutlined />}
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </GlassCard>
      </div>
    </div>
  );
};

export default SettingsPage;
