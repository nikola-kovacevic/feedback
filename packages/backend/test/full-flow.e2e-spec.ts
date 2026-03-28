/**
 * Full-flow e2e tests for Feedback Hub API.
 * Runs against a live server (Docker or local dev).
 * Set BASE_URL env var to override (default: http://localhost:3000).
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

function api(path: string, options: RequestInit = {}) {
  const { headers: extraHeaders, ...rest } = options;
  return fetch(`${BASE}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...(extraHeaders as any) },
  });
}

function authApi(path: string, token: string, options: RequestInit = {}) {
  const { headers: extraHeaders, ...rest } = options;
  return api(path, {
    ...rest,
    headers: { Authorization: `Bearer ${token}`, ...(extraHeaders as any) },
  });
}

describe('Feedback Hub Full Flow (e2e)', () => {
  let accessToken: string;
  let refreshToken: string;
  let appId: string;
  let apiKey: string;

  const testUser = {
    email: `e2e-${Date.now()}@test.com`,
    password: 'TestPass123!',
    name: 'E2E Tester',
  };

  // ─── Auth ───────────────────────────────────────────────
  describe('Auth', () => {
    it('should register a new user', async () => {
      const res = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(testUser),
      });
      expect(res.status).toBe(201);
      const body = await res.json() as any;
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
      expect(body.user.email).toBe(testUser.email);
      expect(body.user.passwordHash).toBeUndefined();
      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
    });

    it('should reject duplicate email', async () => {
      const res = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(testUser),
      });
      expect(res.status).toBe(409);
    });

    it('should login with valid credentials', async () => {
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
      });
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.accessToken).toBeDefined();
      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
    });

    it('should reject wrong password', async () => {
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: testUser.email, password: 'wrong' }),
      });
      expect(res.status).toBe(401);
    });

    it('should return current user via /me', async () => {
      const res = await authApi('/api/auth/me', accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.email).toBe(testUser.email);
    });

    it('should reject /me without token', async () => {
      const res = await api('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should refresh tokens', async () => {
      const res = await api('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.accessToken).toBeDefined();
      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
    });

    it('should change password', async () => {
      const res = await authApi('/api/auth/change-password', accessToken, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: testUser.password,
          newPassword: 'NewPass456!',
        }),
      });
      expect(res.status).toBe(201);
    });

    it('should login with new password', async () => {
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: testUser.email, password: 'NewPass456!' }),
      });
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      accessToken = body.accessToken;
      testUser.password = 'NewPass456!';
    });
  });

  // ─── Applications ──────────────────────────────────────
  describe('Applications', () => {
    it('should create an application with widgetConfig', async () => {
      const res = await authApi('/api/applications', accessToken, {
        method: 'POST',
        body: JSON.stringify({
          name: 'E2E Test App',
          description: 'Created by e2e tests',
          widgetConfig: {
            mode: 'floating',
            question: 'How do you like this app?',
            commentRequired: true,
            themeColor: '#354B8C',
            cooldownHours: 24,
            position: 'bottom-right',
          },
        }),
      });
      expect(res.status).toBe(201);
      const body = await res.json() as any;
      expect(body.name).toBe('E2E Test App');
      expect(body.apiKey).toMatch(/^fb_/);
      expect(body.widgetConfig.mode).toBe('floating');
      appId = body.id;
      apiKey = body.apiKey;
    });

    it('should reject create without auth', async () => {
      const res = await api('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ name: 'Fail' }),
      });
      expect(res.status).toBe(401);
    });

    it('should list applications', async () => {
      const res = await authApi('/api/applications', accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.length).toBeGreaterThanOrEqual(1);
    });

    it('should get application by ID', async () => {
      const res = await authApi(`/api/applications/${appId}`, accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.id).toBe(appId);
    });

    it('should update application', async () => {
      const res = await authApi(`/api/applications/${appId}`, accessToken, {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated E2E App' }),
      });
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.name).toBe('Updated E2E App');
    });

    it('should regenerate API key with grace period', async () => {
      const oldKey = apiKey;
      const res = await authApi(`/api/applications/${appId}/regenerate-key`, accessToken, {
        method: 'POST',
      });
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.apiKey).not.toBe(oldKey);
      expect(body.previousApiKeyExpiresAt).toBeDefined();
      // Old key should still work during grace period
      const oldKeyRes = await api(`/api/widget/config/${oldKey}`);
      expect(oldKeyRes.status).toBe(200);
      apiKey = body.apiKey;
    });
  });

  // ─── Widget API ────────────────────────────────────────
  describe('Widget API', () => {
    it('should return widget config', async () => {
      const res = await api(`/api/widget/config/${apiKey}`);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.question).toBe('How do you like this app?');
      expect(body.mode).toBe('floating');
    });

    it('should 404 for invalid API key', async () => {
      const res = await api('/api/widget/config/fb_invalid');
      expect(res.status).toBe(404);
    });

    it('should submit feedback (score 9, positive)', async () => {
      const res = await api('/api/widget/feedback', {
        method: 'POST',
        body: JSON.stringify({ apiKey, score: 9, comment: 'Excellent product!' }),
      });
      expect(res.status).toBe(201);
      const body = await res.json() as any;
      expect(body.score).toBe(9);
      expect(body.sentiment).toBe('positive');
    });

    it('should submit feedback (score 3, negative)', async () => {
      const res = await api('/api/widget/feedback', {
        method: 'POST',
        body: JSON.stringify({ apiKey, score: 3, comment: 'Terrible, very slow and buggy' }),
      });
      expect(res.status).toBe(201);
      const body = await res.json() as any;
      expect(body.sentiment).toBe('negative');
    });

    it('should submit feedback (score 7)', async () => {
      const res = await api('/api/widget/feedback', {
        method: 'POST',
        body: JSON.stringify({ apiKey, score: 7, comment: 'Pretty good overall' }),
      });
      expect(res.status).toBe(201);
    });

    it('should submit feedback (score 10)', async () => {
      const res = await api('/api/widget/feedback', {
        method: 'POST',
        body: JSON.stringify({ apiKey, score: 10, comment: 'Amazing experience!' }),
      });
      expect(res.status).toBe(201);
    });

    it('should submit feedback (score 2)', async () => {
      const res = await api('/api/widget/feedback', {
        method: 'POST',
        body: JSON.stringify({ apiKey, score: 2, comment: 'Bad app, not usable' }),
      });
      expect(res.status).toBe(201);
    });

    it('should reject score out of range', async () => {
      const res = await api('/api/widget/feedback', {
        method: 'POST',
        body: JSON.stringify({ apiKey, score: 11, comment: 'Invalid' }),
      });
      expect(res.status).toBe(400);
    });

    it('should reject invalid API key for feedback', async () => {
      const res = await api('/api/widget/feedback', {
        method: 'POST',
        body: JSON.stringify({ apiKey: 'fb_doesnotexist', score: 5, comment: 'Test' }),
      });
      expect(res.status).toBe(404);
    });
  });

  // ─── Feedback Listing ──────────────────────────────────
  describe('Feedback Listing', () => {
    it('should list all feedback (5 entries)', async () => {
      const res = await authApi(`/api/feedback?applicationId=${appId}`, accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.items).toBeDefined();
      expect(body.items.length).toBe(5);
      expect(body.total).toBe(5);
    });

    it('should filter by applicationId', async () => {
      const res = await authApi(`/api/feedback?applicationId=${appId}`, accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.items.length).toBe(5);
    });
  });

  // ─── Analytics ─────────────────────────────────────────
  describe('Analytics', () => {
    it('should return summary with correct totals', async () => {
      const res = await authApi(`/api/analytics/summary?applicationId=${appId}`, accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.totalResponses).toBe(5);
      expect(typeof body.averageScore).toBe('number');
      expect(typeof body.npsScore).toBe('number');
    });

    it('should return score distribution (11 items)', async () => {
      const res = await authApi('/api/analytics/distribution', accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.length).toBe(11);
    });

    it('should return trends', async () => {
      const res = await authApi('/api/analytics/trends?granularity=daily', accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThanOrEqual(1);
    });

    it('should return sentiment breakdown', async () => {
      const res = await authApi(`/api/analytics/sentiment?applicationId=${appId}`, accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.positive).toBeDefined();
      expect(body.negative).toBeDefined();
      expect(body.neutral).toBeDefined();
      expect(body.positive + body.negative + body.neutral).toBe(5);
    });

    it('should return word cloud', async () => {
      const res = await authApi('/api/analytics/word-cloud', accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(Array.isArray(body)).toBe(true);
    });

    it('should return comparison', async () => {
      const res = await authApi('/api/analytics/comparison', accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Export ────────────────────────────────────────────
  describe('Export', () => {
    it('should export as CSV', async () => {
      const res = await authApi(`/api/feedback/export?format=csv&applicationId=${appId}`, accessToken);
      expect([200, 201]).toContain(res.status);
      const text = await res.text();
      expect(text).toContain('id,applicationId,score,comment,sentiment,createdAt');
      const lines = text.trim().split('\n');
      expect(lines.length).toBe(6); // header + 5 rows
    });

    it('should export as JSON', async () => {
      const res = await authApi(`/api/feedback/export?format=json&applicationId=${appId}`, accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(5);
    });
  });

  // ─── Widget JS Bundle ───────────────────────────────────
  describe('Widget JS Bundle', () => {
    it('should serve feedback.js at /widget/feedback.js', async () => {
      const res = await fetch(`${BASE}/widget/feedback.js`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('FeedbackWidget');
    });

    it('should contain FeedbackWidget.init and FeedbackWidget.render', async () => {
      const res = await fetch(`${BASE}/widget/feedback.js`);
      const text = await res.text();
      expect(text).toContain('init');
      expect(text).toContain('render');
    });
  });

  // ─── Export API ────────────────────────────────────────
  describe('Export API edge cases', () => {
    it('should return empty CSV when no data matches filter', async () => {
      // Use a non-existent applicationId
      const res = await authApi(
        '/api/feedback/export?format=csv&applicationId=00000000-0000-0000-0000-000000000000',
        accessToken,
      );
      expect([200, 201]).toContain(res.status);
      const text = await res.text();
      // Should have header but no data rows
      expect(text).toContain('id,applicationId');
    });

    it('should return empty JSON array when no data matches filter', async () => {
      const res = await authApi(
        '/api/feedback/export?format=json&applicationId=00000000-0000-0000-0000-000000000000',
        accessToken,
      );
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    });
  });

  // ─── Cleanup ───────────────────────────────────────────
  describe('Cleanup', () => {
    it('should delete the application', async () => {
      const res = await authApi(`/api/applications/${appId}`, accessToken, {
        method: 'DELETE',
      });
      expect([200, 201]).toContain(res.status);
    });

    it('should have empty applications list', async () => {
      const res = await authApi('/api/applications', accessToken);
      expect([200, 201]).toContain(res.status);
      const body = await res.json() as any;
      expect(body.length).toBe(0);
    });
  });
});
