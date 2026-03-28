import type { WidgetConfig } from './types';
import { fetchConfig, submitFeedback } from './api';
import { getStyles } from './styles';

const TRIGGER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>`;

function cooldownKey(apiKey: string): string {
  return `fb_widget_last_submit_${apiKey}`;
}

function isCoolingDown(apiKey: string, cooldownHours: number): boolean {
  const last = localStorage.getItem(cooldownKey(apiKey));
  if (!last) return false;
  const elapsed = Date.now() - parseInt(last, 10);
  return elapsed < cooldownHours * 60 * 60 * 1000;
}

function setCooldown(apiKey: string): void {
  localStorage.setItem(cooldownKey(apiKey), String(Date.now()));
}

export function createWidget(
  config: WidgetConfig,
  apiKey: string,
  userMetadata?: Record<string, unknown>,
  container?: HTMLElement,
): void {
  const isInline = config.mode === 'inline';

  const host = isInline && container ? container : document.createElement('div');
  if (!isInline) {
    document.body.appendChild(host);
  }

  const shadow = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = getStyles(config.themeColor);
  shadow.appendChild(style);

  // Cooldown check
  if (isCoolingDown(apiKey, config.cooldownHours)) {
    const panel = document.createElement('div');
    panel.className = isInline ? 'fb-panel inline-mode' : 'fb-panel open';
    const cooldownMsg = document.createElement('div');
    cooldownMsg.className = 'fb-cooldown';
    cooldownMsg.textContent = 'Thank you! You have already submitted feedback.';
    panel.appendChild(cooldownMsg);

    if (isInline) {
      shadow.appendChild(panel);
    } else {
      // Still show trigger for floating, but panel shows cooldown
      const trigger = createTrigger(shadow, panel);
      shadow.appendChild(trigger);
      shadow.appendChild(panel);
      panel.classList.remove('open');
    }
    return;
  }

  const panel = document.createElement('div');
  panel.className = isInline ? 'fb-panel inline-mode' : 'fb-panel';

  // Question
  const question = document.createElement('div');
  question.className = 'fb-question';
  question.textContent = config.question; // textContent for XSS prevention
  panel.appendChild(question);

  // Score buttons
  const scoresRow = document.createElement('div');
  scoresRow.className = 'fb-scores';
  let selectedScore: number | null = null;

  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'fb-score-btn';
    btn.textContent = String(i);
    btn.type = 'button';
    btn.addEventListener('click', () => {
      selectedScore = i;
      scoresRow.querySelectorAll('.fb-score-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    scoresRow.appendChild(btn);
  }
  panel.appendChild(scoresRow);

  // Labels
  const labels = document.createElement('div');
  labels.className = 'fb-labels';
  const labelLeft = document.createElement('span');
  labelLeft.textContent = 'Not likely';
  const labelRight = document.createElement('span');
  labelRight.textContent = 'Very likely';
  labels.appendChild(labelLeft);
  labels.appendChild(labelRight);
  panel.appendChild(labels);

  // Comment textarea
  const comment = document.createElement('textarea');
  comment.className = 'fb-comment';
  comment.placeholder = config.commentRequired
    ? 'Please tell us more (required)…'
    : 'Tell us more (optional)…';
  panel.appendChild(comment);

  // Error message (hidden by default)
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fb-error';
  errorDiv.style.display = 'none';
  panel.appendChild(errorDiv);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.className = 'fb-submit';
  submitBtn.textContent = 'Submit';
  submitBtn.type = 'button';
  submitBtn.addEventListener('click', async () => {
    errorDiv.style.display = 'none';

    if (selectedScore === null) {
      errorDiv.textContent = 'Please select a score.';
      errorDiv.style.display = 'block';
      return;
    }

    if (config.commentRequired && !comment.value.trim()) {
      errorDiv.textContent = 'A comment is required.';
      errorDiv.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    const ok = await submitFeedback(apiKey, selectedScore, comment.value.trim(), userMetadata);

    if (ok) {
      setCooldown(apiKey);
      panel.innerHTML = '';
      const thanks = document.createElement('div');
      thanks.className = 'fb-thank-you';
      thanks.textContent = 'Thank you for your feedback!';
      panel.appendChild(thanks);

      if (!isInline) {
        setTimeout(() => {
          panel.classList.remove('open');
        }, 3000);
      }
    } else {
      errorDiv.textContent = 'Something went wrong. Please try again.';
      errorDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
  panel.appendChild(submitBtn);

  shadow.appendChild(panel);

  // Floating trigger button
  if (!isInline) {
    const trigger = createTrigger(shadow, panel);
    shadow.appendChild(trigger);
  }
}

function createTrigger(shadow: ShadowRoot, panel: HTMLElement): HTMLButtonElement {
  const trigger = document.createElement('button');
  trigger.className = 'fb-trigger';
  trigger.innerHTML = TRIGGER_ICON;
  trigger.type = 'button';
  trigger.addEventListener('click', () => {
    panel.classList.toggle('open');
  });
  return trigger;
}

export async function init(
  apiKey: string,
  userMetadata?: Record<string, unknown>,
): Promise<void> {
  const config = await fetchConfig(apiKey);
  if (!config) return; // graceful degradation
  createWidget(config, apiKey, userMetadata);
}

export async function render(
  apiKey: string,
  target: string,
  userMetadata?: Record<string, unknown>,
): Promise<void> {
  const container = document.querySelector(target) as HTMLElement | null;
  if (!container) return;

  const config = await fetchConfig(apiKey);
  if (!config) return;

  // Force inline mode when rendering to a target
  config.mode = 'inline';
  createWidget(config, apiKey, userMetadata, container);
}
