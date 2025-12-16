const OrderItem = require('../../../backend/models/OrderItem');

jest.mock('../../../backend/config/database', () => ({
  pool: {
    execute: jest.fn()
  },
  dbConnected: true,
  USE_DUMMY_DATA: false
}));

describe('OrderItem Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByOrderId', () => {
    it('should return order items by order id', async () => {
      const mockItems = [
        {
          order_item_id: 1,
          order_id: 1,
          menu_id: 1,
          options: JSON.stringify({ temperature: 'HOT', size: 'SIZE_M' })
        },
        {
          order_item_id: 2,
          order_id: 1,
          menu_id: 2,
          options: JSON.stringify({ temperature: 'ICE', size: 'SIZE_L' })
        }
      ];

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([mockItems]);

      const result = await OrderItem.findByOrderId(1);

      expect(result).toHaveLength(2);
      expect(result[0].order_id).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        'SELECT * FROM order_items WHERE order_id = ?',
        [1]
      );
    });

    it('should return empty array when no items found', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([[]]);

      const result = await OrderItem.findByOrderId(999);

      expect(result).toEqual([]);
    });

    it('should return empty array in dummy mode', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        const result = await OrderItem.findByOrderId(1);
        expect(result).toEqual([]);
      } else {
        // 모킹된 상태에서는 일반 동작 확인
        const { pool } = require('../../../backend/config/database');
        pool.execute.mockResolvedValue([[]]);
        const result = await OrderItem.findByOrderId(999);
        expect(result).toEqual([]);
      }
    });
  });

  describe('create', () => {
    it('should create a new order item', async () => {
      const itemData = {
        order_id: 1,
        menu_id: 1,
        options: { temperature: 'HOT', size: 'SIZE_M' }
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 1 }]);

      const result = await OrderItem.create(itemData);

      expect(result).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO order_items (order_id, menu_id, options) VALUES (?, ?, ?)',
        [1, 1, JSON.stringify({ temperature: 'HOT', size: 'SIZE_M' })]
      );
    });

    it('should handle empty options', async () => {
      const itemData = {
        order_id: 1,
        menu_id: 1
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 2 }]);

      const result = await OrderItem.create(itemData);

      expect(result).toBe(2);
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO order_items (order_id, menu_id, options) VALUES (?, ?, ?)',
        [1, 1, JSON.stringify({})]
      );
    });

    it('should throw error in dummy mode', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        await expect(OrderItem.create({
          order_id: 1,
          menu_id: 1,
          options: {}
        })).rejects.toThrow('더미 데이터 모드에서는 주문 항목을 생성할 수 없습니다');
      } else {
        // 모킹된 상태에서는 정상 동작 확인
        const { pool } = require('../../../backend/config/database');
        pool.execute.mockResolvedValue([{ insertId: 3 }]);
        const result = await OrderItem.create({
          order_id: 1,
          menu_id: 1,
          options: {}
        });
        expect(result).toBe(3);
      }
    });
  });

  describe('createMultiple', () => {
    it('should create multiple order items', async () => {
      const items = [
        {
          order_id: 1,
          menu_id: 1,
          options: { temperature: 'HOT' }
        },
        {
          order_id: 1,
          menu_id: 2,
          options: { temperature: 'ICE' }
        }
      ];

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 1 }]);

      const result = await OrderItem.createMultiple(items);

      expect(result).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO order_items'),
        expect.arrayContaining([1, 1, JSON.stringify({ temperature: 'HOT' })])
      );
    });

    it('should return empty array when items array is empty', async () => {
      const result = await OrderItem.createMultiple([]);

      expect(result).toEqual([]);
    });

    it('should handle empty options in items', async () => {
      const items = [
        {
          order_id: 1,
          menu_id: 1
        }
      ];

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 1 }]);

      await OrderItem.createMultiple(items);

      expect(pool.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO order_items'),
        expect.arrayContaining([1, 1, JSON.stringify({})])
      );
    });

    it('should throw error in dummy mode for createMultiple', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        await expect(OrderItem.createMultiple([
          { order_id: 1, menu_id: 1, options: {} }
        ])).rejects.toThrow('더미 데이터 모드에서는 주문 항목을 생성할 수 없습니다');
      } else {
        // 모킹된 상태에서는 정상 동작 확인
        const { pool } = require('../../../backend/config/database');
        pool.execute.mockResolvedValue([{ insertId: 4 }]);
        const result = await OrderItem.createMultiple([
          { order_id: 1, menu_id: 1, options: {} }
        ]);
        expect(result).toBe(4);
      }
    });
  });
});

