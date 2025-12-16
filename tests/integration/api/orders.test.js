const request = require('supertest');
const app = require('../../../backend/server');

describe('Order API Integration Tests', () => {
  describe('POST /api/orders', () => {
    it('should create a new order with valid data (skip in dummy mode)', async () => {
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
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('order_id');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('created_at');
      expect(response.body.status).toBe('접수');
    });

    it('should return 400 when user_id is missing', async () => {
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

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when items array is empty', async () => {
      const orderData = {
        user_id: 1,
        items: []
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when items is missing', async () => {
      const orderData = {
        user_id: 1
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/orders', () => {
    it('should return orders list', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    it('should return orders filtered by user_id', async () => {
      const response = await request(app)
        .get('/api/orders?user_id=1')
        .expect(200);

      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    it('should return orders with items', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      if (response.body.orders.length > 0) {
        const order = response.body.orders[0];
        expect(order).toHaveProperty('items');
        expect(Array.isArray(order.items)).toBe(true);
      }
    });
  });
});

