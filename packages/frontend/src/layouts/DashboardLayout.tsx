import React, { useState } from 'react';
import { Layout, Menu, Typography, Divider, Button } from 'antd';
import { LogoutOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import SystemFeedbackWidget from '../components/SystemFeedbackWidget';
import logo from '../assets/pulseloop.png';

const { Sider, Content } = Layout;
const { Title } = Typography;

const NAV_ITEMS = [
  { key: '/', label: 'Dashboard' },
  { key: '/applications', label: 'Applications' },
  { key: '/responses', label: 'Responses' },
  { key: '/comparison', label: 'Comparison' },
  { key: '/export', label: 'Export' },
  { key: '/settings', label: 'Settings' },
];

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const selectedKey = NAV_ITEMS.find((item) =>
    item.key === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.key),
  )?.key || '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Burger menu button — visible when sidebar is collapsed on mobile */}
      {collapsed && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(false)}
          aria-label="Open navigation menu"
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 20,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(53, 75, 140, 0.9)',
            color: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            border: 'none',
          }}
        />
      )}

      {/* Overlay when sidebar is open on mobile */}
      {!collapsed && (
        <div
          className="sidebar-overlay"
          onClick={() => setCollapsed(true)}
          style={{
            display: 'none', // shown via CSS media query
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 9,
          }}
        />
      )}

      <Sider
        className="glass-sider"
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        collapsedWidth={0}
        trigger={null}
        role="navigation"
        aria-label="Main navigation"
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 10 }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '16px 0',
          }}
        >
          <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
              onClick={() => navigate('/')}
              role="button"
              aria-label="Go to dashboard"
            >
              <img
                src={logo}
                alt="PulseLoop"
                style={{ width: 32, height: 32, borderRadius: 6 }}
              />
              <Title
                level={4}
                className="sidebar-brand"
                style={{ margin: 0, color: 'rgba(255, 255, 255, 0.95)', whiteSpace: 'nowrap' }}
              >
                PulseLoop
              </Title>
            </div>
            {/* Close button on mobile */}
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setCollapsed(true)}
              className="sidebar-close-btn"
              aria-label="Close navigation menu"
              style={{
                display: 'none', // shown via CSS media query
                color: 'rgba(255,255,255,0.7)',
                border: 'none',
                padding: 4,
              }}
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={NAV_ITEMS}
            onClick={({ key }) => {
              navigate(key);
              // Close sidebar on mobile after navigation
              if (window.innerWidth < 768) setCollapsed(true);
            }}
            style={{ border: 'none', flex: 1 }}
            aria-label="Page navigation"
          />

          <div style={{ padding: '0 12px' }}>
            <Divider style={{ margin: '8px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
            <ThemeToggle />
            <Divider style={{ margin: '8px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              aria-label="Log out"
              block
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'left',
                height: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.background = 'rgba(217, 58, 43, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 0 : 220,
          transition: 'margin-left 0.2s',
        }}
      >
        <Content
          role="main"
          aria-label="Page content"
          style={{
            padding: 24,
            minHeight: 'calc(100vh - 48px)',
          }}
        >
          <Outlet />
          <SystemFeedbackWidget />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
