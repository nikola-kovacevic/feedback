import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  resolved: 'light',
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return getSystemTheme();
  return mode;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme_mode');
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
  });

  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolveTheme(mode));

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme_mode', newMode);
  }, []);

  useEffect(() => {
    setResolved(resolveTheme(mode));
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system') return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setResolved(getSystemTheme());
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
  }, [resolved]);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
