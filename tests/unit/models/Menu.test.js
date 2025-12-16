const Menu = require('../../../backend/models/Menu');

// 데이터베이스 모듈 모킹
jest.mock('../../../backend/config/database', () => ({
  pool: {
    execute: jest.fn()
  },
  dbConnected: true,
  USE_DUMMY_DATA: false
}));

describe('Menu Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all menus', async () => {
      const mockMenus = [
        {
          menu_id: 1,
          name: '아메리카노',
          price: 4000,
          options: JSON.stringify(['HOT', 'ICE', 'SIZE_M'])
        },
        {
          menu_id: 2,
          name: '카페라떼',
          price: 4500,
          options: JSON.stringify(['HOT', 'ICE', 'SIZE_M'])
        }
      ];

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([mockMenus]);

      const result = await Menu.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('아메리카노');
      expect(result[1].name).toBe('카페라떼');
      expect(pool.execute).toHaveBeenCalledWith(
        'SELECT * FROM menus ORDER BY menu_id ASC'
      );
    });

    it('should return empty array when no menus exist', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([[]]);

      const result = await Menu.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a menu by id', async () => {
      const mockMenu = {
        menu_id: 1,
        name: '아메리카노',
        price: 4000,
        options: JSON.stringify(['HOT', 'ICE'])
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([[mockMenu]]);

      const result = await Menu.findById(1);

      expect(result).toEqual(mockMenu);
      expect(pool.execute).toHaveBeenCalledWith(
        'SELECT * FROM menus WHERE menu_id = ?',
        [1]
      );
    });

    it('should return undefined when menu not found', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([[]]);

      const result = await Menu.findById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new menu', async () => {
      const menuData = {
        name: '카푸치노',
        price: 4500,
        options: ['HOT', 'ICE']
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 3 }]);

      const result = await Menu.create(menuData);

      expect(result).toBe(3);
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO menus (name, price, options) VALUES (?, ?, ?)',
        ['카푸치노', 4500, JSON.stringify(['HOT', 'ICE'])]
      );
    });

    it('should handle empty options', async () => {
      const menuData = {
        name: '에스프레소',
        price: 3000
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 4 }]);

      const result = await Menu.create(menuData);

      expect(result).toBe(4);
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO menus (name, price, options) VALUES (?, ?, ?)',
        ['에스프레소', 3000, JSON.stringify([])]
      );
    });
  });

  describe('update', () => {
    it('should update an existing menu', async () => {
      const menuData = {
        name: '아메리카노',
        price: 4500,
        options: ['HOT', 'ICE', 'SIZE_L']
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await Menu.update(1, menuData);

      expect(result).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        'UPDATE menus SET name = ?, price = ?, options = ? WHERE menu_id = ?',
        ['아메리카노', 4500, JSON.stringify(['HOT', 'ICE', 'SIZE_L']), 1]
      );
    });
  });

  describe('delete', () => {
    it('should delete a menu', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await Menu.delete(1);

      expect(result).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        'DELETE FROM menus WHERE menu_id = ?',
        [1]
      );
    });
  });
});

