const { pool, dbConnected, USE_DUMMY_DATA } = require('../config/database');

class Order {
  static async findById(orderId) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return null;
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );
    return rows[0];
  }

  static async findByUserId(userId) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return [];
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async findAll() {
    if (USE_DUMMY_DATA || !dbConnected) {
      return [];
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    return rows;
  }

  static async create(orderData) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 주문을 생성할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    const { user_id, status = '접수' } = orderData;
    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, status) VALUES (?, ?)',
      [user_id, status]
    );
    return result.insertId;
  }

  static async updateStatus(orderId, status) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 주문 상태를 변경할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    await pool.execute(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );
    return orderId;
  }
}

module.exports = Order;

