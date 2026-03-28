import React, { useState } from 'react';
import { Layout, Menu, Typography, Divider, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
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
          <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
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

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={NAV_ITEMS}
            onClick={({ key }) => navigate(key)}
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
