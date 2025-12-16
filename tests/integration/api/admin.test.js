const request = require('supertest');
const app = require('../../../backend/server');

describe('Admin API Integration Tests', () => {
  describe('POST /api/admin/menus', () => {
    it('should create a new menu with valid data (skip in dummy mode)', async () => {
      // 더미 데이터 모드에서는 메뉴 생성이 불가능하므로 스킵
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping menu creation test in dummy data mode');
        return;
      }

      const menuData = {
        name: '테스트 메뉴',
        price: 5000,
        options: ['HOT', 'ICE', 'SIZE_M']
      };

      const response = await request(app)
        .post('/api/admin/menus')
        .send(menuData)
        .expect(201);

      expect(response.body).toHaveProperty('menu_id');
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when name is missing', async () => {
      const menuData = {
        price: 5000,
        options: ['HOT', 'ICE']
      };

      const response = await request(app)
        .post('/api/admin/menus')
        .send(menuData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when price is missing', async () => {
      const menuData = {
        name: '테스트 메뉴',
        options: ['HOT', 'ICE']
      };

      const response = await request(app)
        .post('/api/admin/menus')
        .send(menuData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/admin/menus/:id', () => {
    it('should update an existing menu (skip in dummy mode)', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping menu update test in dummy data mode');
        return;
      }

      const menuData = {
        name: '수정된 메뉴',
        price: 5500,
        options: ['HOT', 'ICE', 'SIZE_L']
      };

      const response = await request(app)
        .put('/api/admin/menus/1')
        .send(menuData)
        .expect(200);

      expect(response.body).toHaveProperty('menu_id');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/admin/menus/:id', () => {
    it('should delete a menu (skip in dummy mode)', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping menu delete test in dummy data mode');
        return;
      }

      const response = await request(app)
        .delete('/api/admin/menus/1')
        .expect(200);

      expect(response.body).toHaveProperty('menu_id');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/admin/orders/:id/status', () => {
    it('should update order status with valid status (skip in dummy mode)', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping order status update test in dummy data mode');
        return;
      }

      const statusData = {
        status: '제조중'
      };

      const response = await request(app)
        .put('/api/admin/orders/1/status')
        .send(statusData)
        .expect(200);

      expect(response.body).toHaveProperty('order_id');
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('제조중');
    });

    it('should return 400 when status is missing', async () => {
      const response = await request(app)
        .put('/api/admin/orders/1/status')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when status is invalid', async () => {
      const statusData = {
        status: '잘못된상태'
      };

      const response = await request(app)
        .put('/api/admin/orders/1/status')
        .send(statusData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should accept valid status values (skip in dummy mode)', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        console.log('Skipping order status validation test in dummy data mode');
        return;
      }

      const validStatuses = ['접수', '제조중', '완료'];

      for (const status of validStatuses) {
        const response = await request(app)
          .put('/api/admin/orders/1/status')
          .send({ status })
          .expect(200);

        expect(response.body.status).toBe(status);
      }
    });
  });
});

