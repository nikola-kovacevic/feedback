import React from 'react';
import { useTheme } from '../context/ThemeContext';

type ThemeMode = 'light' | 'system' | 'dark';

const ThemeToggle: React.FC = () => {
  const { mode, setMode } = useTheme();

  const modes: ThemeMode[] = ['light', 'system', 'dark'];

  return (
    <div style={{ padding: '8px 0' }}>
      <div
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 6,
          textAlign: 'center',
        }}
      >
        Theme
      </div>
      <div
        role="radiogroup"
        aria-label="Theme selection"
        style={{
          display: 'flex',
          gap: 0,
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 6,
          padding: 2,
        }}
      >
        {modes.map((m) => (
          <button
            key={m}
            role="radio"
            aria-checked={mode === m}
            aria-label={`${m} theme`}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: '5px 0',
              textAlign: 'center',
              fontSize: 11,
              fontWeight: mode === m ? 600 : 400,
              color: mode === m ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
              background: mode === m ? 'rgba(255,255,255,0.18)' : 'transparent',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
