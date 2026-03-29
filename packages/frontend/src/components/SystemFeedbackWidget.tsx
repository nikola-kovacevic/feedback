import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import type { Application } from '../types';

const SystemFeedbackWidget: React.FC = () => {
  const { data: systemApp } = useQuery<Application>({
    queryKey: ['system-app'],
    queryFn: async () => {
      const { data } = await client.get('/applications/system');
      return data;
    },
    staleTime: Infinity, // only fetch once per session
    retry: 1,
  });

  useEffect(() => {
    if (!systemApp?.apiKey) return;

    // Check if widget script is already loaded
    if ((window as any).__pulseloop_system_loaded) return;
    (window as any).__pulseloop_system_loaded = true;

    // Dynamically load the widget and init with system app key
    const script = document.createElement('script');
    script.src = `${window.location.origin}/api/widget/config/${systemApp.apiKey}`;

    // Instead of loading the script (which returns JSON), call the widget API directly
    // The widget JS is at /widget/feedback.js
    const widgetScript = document.createElement('script');
    widgetScript.src = `${window.location.origin}/widget/feedback.js`;
    widgetScript.onload = () => {
      if ((window as any).FeedbackWidget) {
        (window as any).FeedbackWidget.init({
          apiKey: systemApp.apiKey,
        });
      }
    };
    document.body.appendChild(widgetScript);

    return () => {
      // Cleanup on unmount (won't happen in practice since this is app-level)
    };
  }, [systemApp?.apiKey]);

  return null; // No visible UI, just loads the widget
};

export default SystemFeedbackWidget;
