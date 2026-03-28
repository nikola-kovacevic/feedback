import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, cleanDatabase } from './helpers/test-setup';

describe('Feedback Hub — Full E2E Flow', () => {
  let app: INestApplication;

  // Shared state across ordered tests
  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  let appId: string;
  let apiKey: string;

  const testEmail = `e2e-${Date.now()}@test.com`;
  const testPassword = 'TestPass123!';
  const newPassword = 'NewPass456!';

  beforeAll(async () => {
    app = await createTestApp();
    await cleanDatabase(app);
  }, 30_000);

  afterAll(async () => {
    // Clean up test data so the database is left pristine
    await cleanDatabase(app);
    await app.close();
  });

  // ---------------------------------------------------------------------------
  // AUTH
  // ---------------------------------------------------------------------------
  describe('Auth', () => {
    it('1. Register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: testEmail, password: testPassword, name: 'E2E Tester' })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).not.toHaveProperty('passwordHash');
      expect(res.body.user.email).toBe(testEmail);

      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
      userId = res.body.user.id;
    });

    it('2. Register duplicate email → 409', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: testEmail, password: testPassword, name: 'Dupe' })
        .expect(409);
    });

    it('3. Login with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');

      // Use fresh tokens going forward
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('4. Login with wrong password → 401', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'WrongPassword99!' })
        .expect(401);
    });

    it('5. GET /api/auth/me with token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.id).toBe(userId);
      expect(res.body.email).toBe(testEmail);
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('6. POST /api/auth/refresh with refreshToken', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');

      // Refresh tokens are single-use; update references
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('7. POST /api/auth/change-password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ currentPassword: testPassword, newPassword })
        .expect(200);

      expect(res.body.message).toMatch(/changed/i);
    });

    it('8. Login with new password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testEmail, password: newPassword })
        .expect(200);

      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });
  });

  // ---------------------------------------------------------------------------
  // APPLICATIONS
  // ---------------------------------------------------------------------------
  describe('Applications', () => {
    const widgetConfig = {
      mode: 'floating' as const,
      question: 'How would you rate this product?',
      commentRequired: false,
      themeColor: '#4F46E5',
      cooldownHours: 24,
      position: 'bottom-right' as const,
    };

    it('9. Create application with full widgetConfig', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'E2E Test App',
          description: 'Created during e2e test run',
          widgetConfig,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('apiKey');
      expect(res.body.apiKey).toMatch(/^fb_/);
      expect(res.body.widgetConfig).toMatchObject(widgetConfig);

      appId = res.body.id;
      apiKey = res.body.apiKey;
    });

    it('10. List applications → array length 1', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(appId);
    });

    it('11. Get application by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/applications/${appId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.id).toBe(appId);
      expect(res.body).toHaveProperty('apiKey');
    });

    it('12. Update application name', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/applications/${appId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'E2E Renamed App' })
        .expect(200);

      expect(res.body.name).toBe('E2E Renamed App');
    });

    it('13. Regenerate API key', async () => {
      const oldKey = apiKey;

      const res = await request(app.getHttpServer())
        .post(`/api/applications/${appId}/regenerate-key`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.apiKey).not.toBe(oldKey);
      expect(res.body.apiKey).toMatch(/^fb_/);
      expect(res.body.previousApiKeyExpiresAt).toBeTruthy();

      apiKey = res.body.apiKey;
    });
  });

  // ---------------------------------------------------------------------------
  // WIDGET
  // ---------------------------------------------------------------------------
  describe('Widget', () => {
    it('14. GET /api/widget/config/:apiKey', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/widget/config/${apiKey}`)
        .expect(200);

      expect(res.body).toHaveProperty('mode');
      expect(res.body).toHaveProperty('question');
      expect(res.body).toHaveProperty('themeColor');
    });

    it('15. Submit feedback — score 9, "Excellent!" → positive', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey, score: 9, comment: 'Excellent!' })
        .expect(201);

      expect(res.body.sentiment).toBe('positive');
      expect(res.body.score).toBe(9);
    });

    it('16. Submit feedback — score 3, "Terrible" → negative', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey, score: 3, comment: 'Terrible experience, nothing works' })
        .expect(201);

      expect(res.body.sentiment).toBe('negative');
    });

    it('17. Submit feedback — score 7, "OK"', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey, score: 7, comment: 'OK' })
        .expect(201);

      expect(res.body).toHaveProperty('id');
    });

    it('18. Submit feedback — score 10, "Amazing!"', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey, score: 10, comment: 'Amazing product, absolutely love it!' })
        .expect(201);

      expect(res.body.score).toBe(10);
    });

    it('19. Submit feedback — score 2, "Bad app"', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey, score: 2, comment: 'Bad app, very disappointing and frustrating' })
        .expect(201);

      expect(res.body.score).toBe(2);
    });

    it('20. Submit feedback — score out of range (11) → 400', async () => {
      await request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey, score: 11, comment: 'Too high' })
        .expect(400);
    });

    it('21. Submit feedback — invalid apiKey → 404', async () => {
      await request(app.getHttpServer())
        .post('/api/widget/feedback')
        .send({ apiKey: 'fb_invalid_key_that_does_not_exist', score: 5, comment: 'Hello' })
        .expect(404);
    });
  });

  // ---------------------------------------------------------------------------
  // FEEDBACK LISTING
  // ---------------------------------------------------------------------------
  describe('Feedback listing', () => {
    it('22. GET /api/feedback → 5 entries', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feedback')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('items');
      expect(res.body).toHaveProperty('total');
      expect(res.body.items).toHaveLength(5);
      expect(res.body.total).toBe(5);
    });

    it('23. GET /api/feedback?applicationId=... → filtered results', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/feedback?applicationId=${appId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.items.length).toBe(5);
      for (const item of res.body.items) {
        expect(item.applicationId).toBe(appId);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------------
  describe('Analytics', () => {
    it('24. GET /api/analytics/summary', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/analytics/summary')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('averageScore');
      expect(res.body).toHaveProperty('npsScore');
      expect(res.body).toHaveProperty('totalResponses');
      expect(res.body.totalResponses).toBe(5);
      expect(typeof res.body.averageScore).toBe('number');
      expect(typeof res.body.npsScore).toBe('number');
    });

    it('25. GET /api/analytics/distribution → 11 items (scores 0-10)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/analytics/distribution')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(11);
      // Every entry has score and count
      for (const entry of res.body) {
        expect(entry).toHaveProperty('score');
        expect(entry).toHaveProperty('count');
      }
    });

    it('26. GET /api/analytics/trends?granularity=daily', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/analytics/trends?granularity=daily')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      // We submitted feedback today so at least 1 bucket
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty('period');
      expect(res.body[0]).toHaveProperty('averageScore');
      expect(res.body[0]).toHaveProperty('count');
    });

    it('27. GET /api/analytics/sentiment', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/analytics/sentiment')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('positive');
      expect(res.body).toHaveProperty('negative');
      expect(res.body).toHaveProperty('neutral');
      expect(typeof res.body.positive).toBe('number');
      expect(typeof res.body.negative).toBe('number');
      expect(typeof res.body.neutral).toBe('number');
      // Total should equal 5
      expect(res.body.positive + res.body.negative + res.body.neutral).toBe(5);
    });

    it('28. GET /api/analytics/word-cloud', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/analytics/word-cloud')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('29. GET /api/analytics/comparison', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/analytics/comparison')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty('applicationId');
      expect(res.body[0]).toHaveProperty('applicationName');
      expect(res.body[0]).toHaveProperty('averageScore');
      expect(res.body[0]).toHaveProperty('totalResponses');
    });
  });

  // ---------------------------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------------------------
  describe('Export', () => {
    it('30. GET /api/feedback/export?format=csv → CSV content', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feedback/export?format=csv')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.headers['content-type']).toMatch(/text\/csv/);
      expect(res.text).toContain('id,applicationId,score,comment,sentiment,createdAt');
      // Should have header + 5 data rows
      const lines = res.text.trim().split('\n');
      expect(lines.length).toBe(6);
    });

    it('31. GET /api/feedback/export?format=json → JSON array', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feedback/export?format=json')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(5);
    });
  });

  // ---------------------------------------------------------------------------
  // CLEANUP — delete application
  // ---------------------------------------------------------------------------
  describe('Application deletion', () => {
    it('32. Delete application', async () => {
      await request(app.getHttpServer())
        .delete(`/api/applications/${appId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('33. List applications → empty array', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });
  });
});
