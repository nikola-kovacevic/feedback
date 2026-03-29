import React, { useState } from 'react';
import { Form, Input, Button, Typography, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      navigate('/');
    } catch (err: any) {
      const msgs = err?.response?.data?.message;
      const errorText = Array.isArray(msgs) ? msgs.join('. ') : (msgs || 'Registration failed. Please try again.');
      message.error(errorText, 6);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
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
          Create Account
        </Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input size="large" placeholder="Your name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: 'block', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </Text>
      </GlassCard>
    </div>
  );
};

export default RegisterPage;
