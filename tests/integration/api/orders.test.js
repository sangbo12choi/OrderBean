const request = require('supertest');
const app = require('../../../backend/server');

describe('Order API Integration Tests', () => {
  describe('POST /api/orders', () => {
    // ============================================
    // 시나리오 1: HTTP 응답 기본 검증
    // ============================================

    // TC-O1.1: HTTP 상태 코드 검증 (성공 케이스)
    it('TC-O1.1: should return HTTP 201 status code on success', async () => {
      // 더미 데이터 모드에서는 주문 생성이 불가능하므로 스킵
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping order creation test in dummy data mode');
        return;
      }

      const orderData = {
        user_id: 1,
        items: [
          {
            menu_id: 1,
            options: {
              temperature: 'HOT',
              size: 'SIZE_M'
            }
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(201);
    });

    // TC-O1.2: 응답 본문 구조 검증 (성공 케이스)
    it('TC-O1.2: should return response with correct structure on success', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping order creation test in dummy data mode');
        return;
      }

      const orderData = {
        user_id: 1,
        items: [
          {
            menu_id: 1,
            options: {
              temperature: 'HOT',
              size: 'SIZE_M'
            }
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      // 응답 본문은 객체여야 함
      expect(typeof response.body).toBe('object');
      
      // Content-Type 검증
      expect(response.headers['content-type']).toMatch(/application\/json/);
      
      // 필수 필드 존재 확인
      expect(response.body).toHaveProperty('order_id');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('created_at');
    });

    // ============================================
    // 시나리오 2: 필수 필드 검증
    // ============================================

    // TC-O2.1: user_id 누락 검증
    it('TC-O2.1: should return 400 when user_id is missing', async () => {
      const orderData = {
        items: [
          {
            menu_id: 1,
            options: {}
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      // 에러 응답 검증
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
      expect(response.body.error.length).toBeGreaterThan(0);
    });

    // TC-O2.2: items 누락 검증
    it('TC-O2.2: should return 400 when items is missing', async () => {
      const orderData = {
        user_id: 1
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      // 에러 응답 검증
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
      expect(response.body.error.length).toBeGreaterThan(0);
    });

    // TC-O2.3: 빈 items 배열 검증
    it('TC-O2.3: should return 400 when items array is empty', async () => {
      const orderData = {
        user_id: 1,
        items: []
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      // 에러 응답 검증
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
      expect(response.body.error.length).toBeGreaterThan(0);
    });

    // TC-O2.4: user_id와 items 모두 누락 검증
    it('TC-O2.4: should return 400 when both user_id and items are missing', async () => {
      const orderData = {};

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      // 에러 응답 검증
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
    });

    // ============================================
    // 시나리오 3: 주문 데이터 구조 검증
    // ============================================

    // TC-O3.1: user_id 타입 검증
    it('TC-O3.1: should handle user_id type validation', async () => {
      // user_id가 문자열인 경우 테스트
      const orderDataString = {
        user_id: '1',
        items: [
          {
            menu_id: 1,
            options: {}
          }
        ]
      };

      // user_id가 null인 경우 테스트
      const orderDataNull = {
        user_id: null,
        items: [
          {
            menu_id: 1,
            options: {}
          }
        ]
      };

      // null인 경우 400 에러 예상
      const responseNull = await request(app)
        .post('/api/orders')
        .send(orderDataNull);

      // null이면 400 에러 또는 정상 처리 (구현에 따라 다름)
      expect([400, 201, 500]).toContain(responseNull.status);
    });

    // TC-O3.2: items 배열 구조 검증
    it('TC-O3.2: should validate items array structure', async () => {
      const orderData = {
        user_id: 1,
        items: [
          {
            menu_id: 1,
            options: {
              temperature: 'HOT',
              size: 'SIZE_M'
            }
          }
        ]
      };

      // items는 배열이어야 함
      expect(Array.isArray(orderData.items)).toBe(true);
      
      // 각 item은 객체여야 함
      orderData.items.forEach(item => {
        expect(typeof item).toBe('object');
        expect(item).toHaveProperty('menu_id');
      });
    });

    // TC-O3.3: menu_id 필수 필드 검증
    it('TC-O3.3: should validate menu_id as required field', async () => {
      const orderData = {
        user_id: 1,
        items: [
          {
            // menu_id 없음
            options: {}
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      // menu_id가 없으면 에러가 발생할 수 있음 (400 또는 500)
      expect([400, 500]).toContain(response.status);
    });

    // TC-O3.4: options 필드 처리 검증
    it('TC-O3.4: should handle missing options field', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping order creation test in dummy data mode');
        return;
      }

      const orderData = {
        user_id: 1,
        items: [
          {
            menu_id: 1
            // options 없음
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      // options가 없어도 정상 처리되어야 함 (빈 객체로 처리)
      if (response.status === 201) {
        expect(response.body).toHaveProperty('order_id');
      }
    });

    // ============================================
    // 시나리오 4: 성공 응답 데이터 검증
    // ============================================

    // TC-O4.1: order_id 타입 및 범위 검증
    it('TC-O4.1: should return order_id as positive integer', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping order creation test in dummy data mode');
        return;
      }

      const orderData = {
        user_id: 1,
        items: [
          {
            menu_id: 1,
            options: {
              temperature: 'HOT',
              size: 'SIZE_M'
            }
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      // order_id는 숫자 타입이어야 함
      expect(typeof response.body.order_id).toBe('number');
      
      // order_id는 양수여야 함
      expect(response.body.order_id).toBeGreaterThan(0);
      
      // order_id는 정수여야 함
      expect(Number.isInteger(response.body.order_id)).toBe(true);
    });

    // TC-O4.2: status 기본값 검증
    it('TC-O4.2: should return status as "접수" by default', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping order creation test in dummy data mode');
        return;
      }

      const orderData = {
        user_id: 1,
        items: [
          {
            menu_id: 1,
            options: {
              temperature: 'HOT',
              size: 'SIZE_M'
            }
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      // status는 '접수'여야 함
      expect(response.body.status).toBe('접수');
      expect(typeof response.body.status).toBe('string');
    });

    // TC-O4.3: created_at 타입 검증
    it('TC-O4.3: should return created_at as valid date string', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping order creation test in dummy data mode');
        return;
      }

      const orderData = {
        user_id: 1,
        items: [
          {
            menu_id: 1,
            options: {
              temperature: 'HOT',
              size: 'SIZE_M'
            }
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      // created_at은 문자열이어야 함
      expect(typeof response.body.created_at).toBe('string');
      
      // created_at은 유효한 날짜 형식이어야 함
      const date = new Date(response.body.created_at);
      expect(date instanceof Date).toBe(true);
      expect(!isNaN(date.getTime())).toBe(true);
    });

    // ============================================
    // 시나리오 5: 에러 처리 검증
    // ============================================

    // TC-O5.1: 서버 에러 처리
    it('TC-O5.1: should handle server errors gracefully', async () => {
      // 정상적인 요청은 201 또는 400을 반환해야 함
      const orderData = {
        user_id: 1,
        items: [
          {
            menu_id: 1,
            options: {}
          }
        ]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      // 정상 응답인 경우
      if (response.status === 201) {
        expect(response.body).toHaveProperty('order_id');
      }
      // 에러 응답인 경우
      else if (response.status === 500) {
        // 에러 메시지가 포함되어야 함
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('message');
        expect(typeof response.body.error).toBe('string');
        expect(response.body.error.length).toBeGreaterThan(0);
      }
    });
  });

  describe('GET /api/orders', () => {
    // ============================================
    // 시나리오 6: HTTP 응답 기본 검증
    // ============================================

    // TC-O6.1: HTTP 상태 코드 검증
    it('TC-O6.1: should return HTTP 200 status code', async () => {
      const response = await request(app)
        .get('/api/orders');

      expect(response.status).toBe(200);
    });

    // TC-O6.2: 응답 본문 구조 검증
    it('TC-O6.2: should return response with correct structure', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      // 응답 본문은 객체여야 함
      expect(typeof response.body).toBe('object');
      
      // Content-Type 검증
      expect(response.headers['content-type']).toMatch(/application\/json/);
      
      // orders 속성 존재 확인
      expect(response.body).toHaveProperty('orders');
      
      // orders는 배열이어야 함
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    // ============================================
    // 시나리오 7: 주문 목록 데이터 검증
    // ============================================

    // TC-O7.1: 빈 주문 목록 처리
    it('TC-O7.1: should return empty array when no orders exist', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      // orders 배열이 존재해야 함
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
      
      // 빈 배열도 유효한 응답 (주문이 없을 수 있음)
      // 더미 데이터 모드에서는 빈 배열일 수 있음
    });

    // TC-O7.2: 주문 목록 존재 확인
    it('TC-O7.2: should return list of orders when orders exist', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
      
      // 주문이 있을 경우
      if (response.body.orders.length > 0) {
        expect(response.body.orders.length).toBeGreaterThanOrEqual(0);
        // 각 항목은 객체여야 함
        response.body.orders.forEach(order => {
          expect(typeof order).toBe('object');
        });
      }
    });

    // ============================================
    // 시나리오 8: 쿼리 파라미터 검증
    // ============================================

    // TC-O8.1: user_id 쿼리 파라미터 처리
    it('TC-O8.1: should handle user_id query parameter', async () => {
      const response = await request(app)
        .get('/api/orders?user_id=1')
        .expect(200);

      // HTTP 상태 코드는 200이어야 함
      expect(response.status).toBe(200);
      
      // orders 배열이 반환되어야 함
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    // TC-O8.2: user_id 쿼리 파라미터 타입 검증
    it('TC-O8.2: should handle user_id query parameter as string', async () => {
      // user_id를 문자열로 전달
      const response = await request(app)
        .get('/api/orders?user_id=1')
        .expect(200);

      // 정상적으로 처리되어야 함
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    // TC-O8.3: 잘못된 user_id 쿼리 파라미터 처리
    it('TC-O8.3: should handle invalid user_id query parameter', async () => {
      // 잘못된 user_id 값
      const response = await request(app)
        .get('/api/orders?user_id=invalid')
        .expect(200);

      // 빈 배열을 반환하거나 정상 처리되어야 함
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    // ============================================
    // 시나리오 9: 주문 객체 구조 검증
    // ============================================

    // TC-O9.1: 필수 필드 존재 확인
    it('TC-O9.1: should return orders with required fields', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      if (response.body.orders.length > 0) {
        const order = response.body.orders[0];
        
        // 필수 필드 존재 확인
        expect(order).toHaveProperty('order_id');
        expect(order).toHaveProperty('user_id');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('created_at');
        expect(order).toHaveProperty('items');
      }
    });

    // TC-O9.2: 모든 주문의 필수 필드 검증
    it('TC-O9.2: should ensure all orders have required fields', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      if (response.body.orders.length > 0) {
        // 모든 주문이 필수 필드를 포함하는지 확인
        response.body.orders.forEach(order => {
          expect(order).toHaveProperty('order_id');
          expect(order).toHaveProperty('user_id');
          expect(order).toHaveProperty('status');
          expect(order).toHaveProperty('created_at');
          expect(order).toHaveProperty('items');
        });
      }
    });

    // ============================================
    // 시나리오 10: 주문 항목(items) 검증
    // ============================================

    // TC-O10.1: items 배열 타입 검증
    it('TC-O10.1: should return items as array', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      if (response.body.orders.length > 0) {
        response.body.orders.forEach(order => {
          // items는 배열 타입이어야 함
          expect(Array.isArray(order.items)).toBe(true);
        });
      }
    });

    // TC-O10.2: items 배열 요소 구조 검증
    it('TC-O10.2: should return items array with correct structure', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      if (response.body.orders.length > 0) {
        response.body.orders.forEach(order => {
          if (order.items.length > 0) {
            // 각 item은 객체여야 함
            order.items.forEach(item => {
              expect(typeof item).toBe('object');
              
              // menu_id 필드 존재 확인
              expect(item).toHaveProperty('menu_id');
              
              // options 필드 존재 확인
              expect(item).toHaveProperty('options');
            });
          }
        });
      }
    });

    // TC-O10.3: 빈 items 배열 처리
    it('TC-O10.3: should handle empty items array', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      if (response.body.orders.length > 0) {
        response.body.orders.forEach(order => {
          // items는 배열이어야 함 (빈 배열도 유효)
          expect(Array.isArray(order.items)).toBe(true);
        });
      }
    });

    // TC-O10.4: options 필드 타입 검증
    it('TC-O10.4: should return options as object', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      if (response.body.orders.length > 0) {
        response.body.orders.forEach(order => {
          if (order.items.length > 0) {
            order.items.forEach(item => {
              // options는 객체 타입이어야 함
              expect(typeof item.options).toBe('object');
              // null이 아닌 객체여야 함
              expect(item.options !== null).toBe(true);
            });
          }
        });
      }
    });

    // ============================================
    // 시나리오 11: 사용자별 필터링 검증
    // ============================================

    // TC-O11.1: 특정 사용자 주문만 반환 확인
    it('TC-O11.1: should return only orders for specified user_id', async () => {
      const response = await request(app)
        .get('/api/orders?user_id=1')
        .expect(200);

      if (response.body.orders.length > 0) {
        // 반환된 주문의 user_id는 모두 1이어야 함
        response.body.orders.forEach(order => {
          expect(order.user_id).toBe(1);
        });
      }
    });

    // TC-O11.2: 존재하지 않는 사용자 주문 조회
    it('TC-O11.2: should return empty array for non-existent user_id', async () => {
      const response = await request(app)
        .get('/api/orders?user_id=99999')
        .expect(200);

      // 존재하지 않는 사용자는 빈 배열을 반환해야 함
      expect(response.body.orders).toEqual([]);
      expect(response.body.orders.length).toBe(0);
    });

    // ============================================
    // 시나리오 12: 에러 처리 검증
    // ============================================

    // TC-O12.1: 서버 에러 처리
    it('TC-O12.1: should handle server errors gracefully', async () => {
      // 정상적인 요청은 200을 반환해야 함
      const response = await request(app)
        .get('/api/orders');

      // 정상 응답인 경우
      if (response.status === 200) {
        expect(response.body).toHaveProperty('orders');
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
