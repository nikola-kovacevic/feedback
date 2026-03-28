import type { WidgetConfig } from './types';

function detectBaseUrl(): string {
  const scripts = document.querySelectorAll('script[src*="feedback.js"]');
  if (scripts.length > 0) {
    const src = (scripts[scripts.length - 1] as HTMLScriptElement).src;
    return new URL(src).origin;
  }
  return '';
}

export async function fetchConfig(apiKey: string): Promise<WidgetConfig | null> {
  try {
    const base = detectBaseUrl();
    const res = await fetch(`${base}/api/widget/config/${apiKey}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function submitFeedback(
  apiKey: string,
  score: number,
  comment: string,
  userMetadata?: Record<string, unknown>,
): Promise<boolean> {
  try {
    const base = detectBaseUrl();
    const res = await fetch(`${base}/api/widget/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, score, comment, userMetadata }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
