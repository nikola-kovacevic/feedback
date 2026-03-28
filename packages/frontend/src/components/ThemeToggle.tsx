import React from 'react';
import { Button, Space } from 'antd';
import { theme } from 'antd';
import { useTheme } from '../context/ThemeContext';

type ThemeMode = 'light' | 'system' | 'dark';

const ThemeToggle: React.FC = () => {
  const { mode, setMode } = useTheme();
  const { token } = theme.useToken();

  const modes: ThemeMode[] = ['light', 'system', 'dark'];

  return (
    <Space size={4} style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
      {modes.map((m) => (
        <Button
          key={m}
          size="small"
          type={mode === m ? 'primary' : 'text'}
          style={{
            fontSize: 12,
            textTransform: 'capitalize',
            color: mode === m ? undefined : token.colorTextSecondary,
          }}
          onClick={() => setMode(m)}
        >
          {m}
        </Button>
      ))}
    </Space>
  );
};

export default ThemeToggle;
