const request = require('supertest');
const app = require('../../../backend/server');

describe('Menu API Integration Tests', () => {
  describe('GET /api/menus', () => {
    it('should return list of menus', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      expect(response.body).toHaveProperty('menus');
      expect(Array.isArray(response.body.menus)).toBe(true);
    });

    it('should return menus with correct structure', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        const menu = response.body.menus[0];
        expect(menu).toHaveProperty('menu_id');
        expect(menu).toHaveProperty('name');
        expect(menu).toHaveProperty('price');
        expect(menu).toHaveProperty('options');
        expect(Array.isArray(menu.options)).toBe(true);
      }
    });

    it('should return valid menu data types', async () => {
      const response = await request(app)
        .get('/api/menus')
        .expect(200);

      if (response.body.menus.length > 0) {
        const menu = response.body.menus[0];
        expect(typeof menu.menu_id).toBe('number');
        expect(typeof menu.name).toBe('string');
        expect(typeof menu.price).toBe('number');
        expect(menu.price).toBeGreaterThan(0);
      }
    });
  });
});

