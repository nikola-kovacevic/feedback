import React, { useState } from 'react';
import { Layout, Menu, Typography, Divider } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { theme } from 'antd';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const { Sider, Content } = Layout;
const { Title } = Typography;

const NAV_ITEMS = [
  { key: '/dashboard', label: 'Dashboard' },
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
  const { token } = theme.useToken();

  const selectedKey = NAV_ITEMS.find((item) =>
    location.pathname.startsWith(item.key),
  )?.key || '/dashboard';

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
          <div style={{ padding: '8px 24px 16px' }}>
            <Title
              level={4}
              style={{ margin: 0, color: token.colorPrimary, whiteSpace: 'nowrap' }}
            >
              Feedback Hub
            </Title>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={NAV_ITEMS}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', flex: 1 }}
          />

          <div style={{ padding: '0 12px' }}>
            <Divider style={{ margin: '8px 0' }} />
            <ThemeToggle />
            <Divider style={{ margin: '8px 0' }} />
            <Menu
              mode="inline"
              selectable={false}
              items={[{ key: 'logout', label: 'Logout' }]}
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{ border: 'none' }}
            />
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
