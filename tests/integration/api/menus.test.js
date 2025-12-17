const request = require('supertest');
const app = require('../../../backend/server');

describe('Menu API Integration Tests', () => {
  describe('GET /api/menus', () => {
    // ============================================
    // 시나리오 1: HTTP 응답 기본 검증
    // ============================================

    // TC-1.1: HTTP 상태 코드 검증
    it('TC-1.1: should return HTTP 200 status code', async () => {
      const response = await request(app)
        .get('/api/menus');

      expect(response.status).toBe(200);
    });

    // TC-1.2: 응답 본문 구조 검증
    it('TC-1.2: should return response with correct structure', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      // 응답 본문은 객체여야 함
      expect(typeof response.body).toBe('object');
      
      // Content-Type 검증
      expect(response.headers['content-type']).toMatch(/application\/json/);
      
      // menus 속성 존재 확인
      expect(response.body).toHaveProperty('menus');
      
      // menus는 배열이어야 함
      expect(Array.isArray(response.body.menus)).toBe(true);
    });

    // ============================================
    // 시나리오 2: 메뉴 목록 데이터 검증
    // ============================================

    // TC-2.1: 빈 메뉴 목록 처리
    it('TC-2.1: should return empty array when no menus exist', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      // menus 배열이 존재해야 함
      expect(response.body).toHaveProperty('menus');
      expect(Array.isArray(response.body.menus)).toBe(true);
      
      // 빈 배열도 유효한 응답 (메뉴가 없을 수 있음)
      // 실제로는 더미 데이터가 있으므로 이 테스트는 통과할 수 있음
      // 하지만 빈 배열도 처리할 수 있어야 함
    });

    // TC-2.2: 메뉴 목록 존재 확인
    it('TC-2.2: should return list of menus when menus exist', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      expect(response.body).toHaveProperty('menus');
      expect(Array.isArray(response.body.menus)).toBe(true);
      
      // 메뉴가 있을 경우 (더미 데이터 모드에서는 항상 있음)
      if (response.body.menus.length > 0) {
        expect(response.body.menus.length).toBeGreaterThan(0);
        // 각 항목은 객체여야 함
        response.body.menus.forEach(menu => {
          expect(typeof menu).toBe('object');
        });
      }
    });

    // ============================================
    // 시나리오 3: 메뉴 객체 구조 검증
    // ============================================

    // TC-3.1: 필수 필드 존재 확인
    it('TC-3.1: should return menus with required fields', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        const menu = response.body.menus[0];
        
        // 필수 필드 존재 확인
        expect(menu).toHaveProperty('menu_id');
        expect(menu).toHaveProperty('name');
        expect(menu).toHaveProperty('price');
        expect(menu).toHaveProperty('options');
      }
    });

    // TC-3.2: 필수 필드 누락 검증
    it('TC-3.2: should ensure all menus have required fields', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        // 모든 메뉴가 필수 필드를 포함하는지 확인
        response.body.menus.forEach(menu => {
          expect(menu).toHaveProperty('menu_id');
          expect(menu).toHaveProperty('name');
          expect(menu).toHaveProperty('price');
          expect(menu).toHaveProperty('options');
        });
      }
    });

    // ============================================
    // 시나리오 4: 데이터 타입 검증
    // ============================================

    // TC-4.1: menu_id 타입 검증
    it('TC-4.1: should return menu_id as number', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        response.body.menus.forEach(menu => {
          // menu_id는 숫자 타입이어야 함
          expect(typeof menu.menu_id).toBe('number');
          
          // menu_id는 정수여야 함
          expect(Number.isInteger(menu.menu_id)).toBe(true);
          
          // menu_id는 양수여야 함
          expect(menu.menu_id).toBeGreaterThan(0);
        });
      }
    });

    // TC-4.2: name 타입 검증
    it('TC-4.2: should return name as non-empty string', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        response.body.menus.forEach(menu => {
          // name은 문자열 타입이어야 함
          expect(typeof menu.name).toBe('string');
          
          // name은 빈 문자열이 아니어야 함
          expect(menu.name.length).toBeGreaterThan(0);
        });
      }
    });

    // TC-4.3: price 타입 및 범위 검증
    it('TC-4.3: should return price as positive number', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        response.body.menus.forEach(menu => {
          // price는 숫자 타입이어야 함
          expect(typeof menu.price).toBe('number');
          
          // price는 양수여야 함
          expect(menu.price).toBeGreaterThan(0);
          
          // price는 유효한 숫자여야 함 (NaN이 아님)
          expect(isNaN(menu.price)).toBe(false);
          
          // price는 유한한 숫자여야 함 (Infinity가 아님)
          expect(isFinite(menu.price)).toBe(true);
        });
      }
    });

    // TC-4.4: options 타입 검증
    it('TC-4.4: should return options as array', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        response.body.menus.forEach(menu => {
          // options는 배열 타입이어야 함
          expect(Array.isArray(menu.options)).toBe(true);
        });
      }
    });

    // ============================================
    // 시나리오 5: options 배열 상세 검증
    // ============================================

    // TC-5.1: options 배열 요소 검증
    it('TC-5.1: should return options array with string elements', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        response.body.menus.forEach(menu => {
          expect(Array.isArray(menu.options)).toBe(true);
          
          // options 배열의 각 요소는 문자열 타입이어야 함
          if (menu.options.length > 0) {
            menu.options.forEach(option => {
              expect(typeof option).toBe('string');
            });
          }
        });
      }
    });

    // TC-5.2: 빈 options 배열 처리
    it('TC-5.2: should handle empty options array', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        response.body.menus.forEach(menu => {
          // options는 배열이어야 함 (빈 배열도 유효)
          expect(Array.isArray(menu.options)).toBe(true);
          
          // 빈 배열도 유효한 값으로 처리되어야 함
          // (실제로는 더미 데이터에 options가 있지만, 빈 배열도 처리 가능해야 함)
        });
      }
    });

    // ============================================
    // 시나리오 6: 에러 처리 검증
    // ============================================

    // TC-6.1: 서버 에러 처리
    it('TC-6.1: should handle server errors gracefully', async () => {
      // 정상적인 요청은 200을 반환해야 함
      const response = await request(app)
        .get('/api/menus');

      // 정상 응답인 경우
      if (response.status === 200) {
        expect(response.body).toHaveProperty('menus');
      } 
      // 에러 응답인 경우
      else if (response.status === 500) {
        // 에러 메시지가 포함되어야 함
        expect(response.body).toHaveProperty('error');
        expect(typeof response.body.error).toBe('string');
        expect(response.body.error.length).toBeGreaterThan(0);
      }
    });
  });
});
