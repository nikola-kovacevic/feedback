export function getStyles(themeColor: string): string {
  return `
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1a1a1a;
    }

    .fb-trigger {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${themeColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      z-index: 999999;
      transition: transform 0.2s ease;
    }

    .fb-trigger:hover {
      transform: scale(1.1);
    }

    .fb-trigger svg {
      width: 24px;
      height: 24px;
      fill: #fff;
    }

    .fb-panel {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 360px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      padding: 24px;
      z-index: 999999;
      display: none;
      animation: fb-slide-up 0.25s ease-out;
    }

    .fb-panel.open {
      display: block;
    }

    .fb-panel.inline-mode {
      position: static;
      bottom: auto;
      right: auto;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      display: block;
      animation: none;
    }

    .fb-question {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #1a1a1a;
    }

    .fb-scores {
      display: flex;
      flex-direction: row;
      gap: 4px;
      margin-bottom: 4px;
    }

    .fb-score-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: #374151;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }

    .fb-score-btn:hover {
      border-color: ${themeColor};
      color: ${themeColor};
    }

    .fb-score-btn.selected {
      background: ${themeColor};
      border-color: ${themeColor};
      color: #fff;
    }

    .fb-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      font-size: 11px;
      color: #9ca3af;
    }

    .fb-comment {
      width: 100%;
      min-height: 72px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      margin-bottom: 12px;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .fb-comment:focus {
      border-color: ${themeColor};
    }

    .fb-submit {
      width: 100%;
      padding: 10px 16px;
      background: ${themeColor};
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .fb-submit:hover {
      opacity: 0.9;
    }

    .fb-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .fb-thank-you {
      text-align: center;
      color: #16a34a;
      font-weight: 600;
      font-size: 16px;
      padding: 24px 0;
    }

    .fb-error {
      color: #dc2626;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .fb-cooldown {
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
      padding: 24px 0;
    }

    @keyframes fb-slide-up {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
}
