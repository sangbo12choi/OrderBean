const { pool, dbConnected, USE_DUMMY_DATA } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async findById(userId) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return { user_id: userId, role: 'customer' };
    }
    
    const [rows] = await pool.execute(
      'SELECT user_id, email, role, created_at, updated_at FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return null;
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  static async findByRole(role) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return [];
    }
    
    const [rows] = await pool.execute(
      'SELECT user_id, email, role, created_at, updated_at FROM users WHERE role = ?',
      [role]
    );
    return rows;
  }

  static async create(userData) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 사용자를 생성할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    const { email, password, role = 'customer' } = userData;
    
    if (!email || !password) {
      throw new Error('email과 password는 필수입니다.');
    }

    // 비밀번호 해싱
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );
    
    // 비밀번호는 반환하지 않음
    const user = await this.findById(result.insertId);
    return user;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;

