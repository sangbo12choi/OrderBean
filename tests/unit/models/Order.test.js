const Order = require('../../../backend/models/Order');

jest.mock('../../../backend/config/database', () => ({
  pool: {
    execute: jest.fn()
  },
  dbConnected: true,
  USE_DUMMY_DATA: false
}));

describe('Order Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return an order by id', async () => {
      const mockOrder = {
        order_id: 1,
        user_id: 1,
        status: '접수',
        created_at: new Date()
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([[mockOrder]]);

      const result = await Order.findById(1);

      expect(result).toEqual(mockOrder);
      expect(pool.execute).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE order_id = ?',
        [1]
      );
    });
  });

  describe('findByUserId', () => {
    it('should return orders for a specific user', async () => {
      const mockOrders = [
        {
          order_id: 1,
          user_id: 1,
          status: '접수',
          created_at: new Date()
        },
        {
          order_id: 2,
          user_id: 1,
          status: '완료',
          created_at: new Date()
        }
      ];

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([mockOrders]);

      const result = await Order.findByUserId(1);

      expect(result).toHaveLength(2);
      expect(result[0].user_id).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [1]
      );
    });
  });

  describe('create', () => {
    it('should create a new order with default status', async () => {
      const orderData = {
        user_id: 1
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 1 }]);

      const result = await Order.create(orderData);

      expect(result).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO orders (user_id, status) VALUES (?, ?)',
        [1, '접수']
      );
    });

    it('should create a new order with custom status', async () => {
      const orderData = {
        user_id: 1,
        status: '제조중'
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 2 }]);

      const result = await Order.create(orderData);

      expect(result).toBe(2);
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO orders (user_id, status) VALUES (?, ?)',
        [1, '제조중']
      );
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await Order.updateStatus(1, '제조중');

      expect(result).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        ['제조중', 1]
      );
    });
  });
});

