const { pool, dbConnected, USE_DUMMY_DATA } = require('../config/database');

class User {
  static async findById(userId) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return { user_id: userId, role: 'customer' };
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async findByRole(role) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return [];
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE role = ?',
      [role]
    );
    return rows;
  }

  static async create(userData) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 사용자를 생성할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    const { role = 'customer' } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (role) VALUES (?)',
      [role]
    );
    return result.insertId;
  }
}

module.exports = User;

