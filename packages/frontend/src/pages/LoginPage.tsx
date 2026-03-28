import React, { useState } from 'react';
import { Form, Input, Button, Typography, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch {
      message.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="main"
      aria-label="Sign in"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 24,
      }}
    >
      <GlassCard style={{ maxWidth: 400, width: '100%' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Sign In
        </Title>
        <Form layout="vertical" onFinish={onFinish} aria-label="Sign in form">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input size="large" placeholder="you@example.com" aria-label="Email address" autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password size="large" placeholder="Password" aria-label="Password" autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: 'block', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Text>
      </GlassCard>
    </div>
  );
};

export default LoginPage;
