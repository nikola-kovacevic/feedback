import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lightTheme, darkTheme } from './styles/theme';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import NewApplicationPage from './pages/NewApplicationPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import ResponsesPage from './pages/ResponsesPage';
import ComparisonPage from './pages/ComparisonPage';
import ExportPage from './pages/ExportPage';
import SettingsPage from './pages/SettingsPage';

import './styles/glass.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ThemedApp: React.FC = () => {
  const { resolved } = useTheme();
  const themeConfig = resolved === 'dark' ? darkTheme : lightTheme;

  return (
    <ConfigProvider theme={themeConfig}>
      <AntApp>
        <AuthProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="applications" element={<ApplicationsPage />} />
                  <Route path="applications/new" element={<NewApplicationPage />} />
                  <Route path="applications/:id" element={<ApplicationDetailPage />} />
                  <Route path="responses" element={<ResponsesPage />} />
                  <Route path="comparison" element={<ComparisonPage />} />
                  <Route path="export" element={<ExportPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
