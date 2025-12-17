const request = require('supertest');
const app = require('../../../backend/server');

describe('Health Check API', () => {
  describe('GET /api/health', () => {
    // ============================================
    // TC-H1: HTTP 응답 기본 검증
    // ============================================

    // TC-H1.1: HTTP 상태 코드 검증
    it('TC-H1.1: should return HTTP 200 status code', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
    });

    // TC-H1.2: 응답 본문 타입 검증
    it('TC-H1.2: should return response body as object', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(typeof response.body).toBe('object');
    });

    // TC-H1.3: Content-Type 헤더 검증
    it('TC-H1.3: should return Content-Type as application/json', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    // ============================================
    // TC-H2: 응답 필드 존재 확인
    // ============================================

    // TC-H2.1: status 필드 존재 확인
    it('TC-H2.1: should return response with status field', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
    });

    // TC-H2.2: message 필드 존재 확인
    it('TC-H2.2: should return response with message field', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    // ============================================
    // TC-H3: 필드 타입 검증
    // ============================================

    // TC-H3.1: status 필드 타입 검증
    it('TC-H3.1: should return status as string', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(typeof response.body.status).toBe('string');
    });

    // TC-H3.2: message 필드 타입 검증
    it('TC-H3.2: should return message as string', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(typeof response.body.message).toBe('string');
    });

    // ============================================
    // TC-H4: 필드 값 검증
    // ============================================

    // TC-H4.1: status 값 검증
    it('TC-H4.1: should return status as "OK"', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
    });

    // TC-H4.2: message 값 검증
    it('TC-H4.2: should return non-empty message', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.message.length).toBeGreaterThan(0);
    });
  });
});

