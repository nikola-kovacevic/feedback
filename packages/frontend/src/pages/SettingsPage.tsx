import React from 'react';
import { Typography, Descriptions, Skeleton } from 'antd';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import dayjs from 'dayjs';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { mode } = useTheme();

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Title level={3}>Settings</Title>

      <GlassCard>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Descriptions column={1} bordered title="User Profile">
            <Descriptions.Item label="Name">{user?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Role">{user?.role ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Member Since">
              {user?.createdAt ? dayjs(user.createdAt).format('MMM D, YYYY') : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Theme Mode">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </GlassCard>
    </div>
  );
};

export default SettingsPage;
