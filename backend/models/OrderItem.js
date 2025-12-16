const { pool, dbConnected, USE_DUMMY_DATA } = require('../config/database');

class OrderItem {
  static async findByOrderId(orderId) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return [];
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    return rows;
  }

  static async create(orderItemData) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 주문 항목을 생성할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    const { order_id, menu_id, options } = orderItemData;
    const [result] = await pool.execute(
      'INSERT INTO order_items (order_id, menu_id, options) VALUES (?, ?, ?)',
      [order_id, menu_id, JSON.stringify(options || {})]
    );
    return result.insertId;
  }

  static async createMultiple(orderItems) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 주문 항목을 생성할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    const values = orderItems.map(item => [
      item.order_id,
      item.menu_id,
      JSON.stringify(item.options || {})
    ]);
    
    if (values.length === 0) return [];
    
    const placeholders = values.map(() => '(?, ?, ?)').join(', ');
    const flatValues = values.flat();
    
    const [result] = await pool.execute(
      `INSERT INTO order_items (order_id, menu_id, options) VALUES ${placeholders}`,
      flatValues
    );
    
    return result.insertId;
  }
}

module.exports = OrderItem;

