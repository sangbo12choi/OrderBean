const { pool, dbConnected, USE_DUMMY_DATA } = require('../config/database');

// 더미 데이터
const DUMMY_MENUS = [
  {
    menu_id: 1,
    name: '아메리카노',
    price: 4000,
    options: ['HOT', 'ICE', 'SIZE_S', 'SIZE_M', 'SIZE_L']
  },
  {
    menu_id: 2,
    name: '카페라떼',
    price: 4500,
    options: ['HOT', 'ICE', 'SIZE_S', 'SIZE_M', 'SIZE_L']
  },
  {
    menu_id: 3,
    name: '카푸치노',
    price: 4500,
    options: ['HOT', 'ICE', 'SIZE_S', 'SIZE_M', 'SIZE_L']
  },
  {
    menu_id: 4,
    name: '카라멜 마키아토',
    price: 5000,
    options: ['HOT', 'ICE', 'SIZE_S', 'SIZE_M', 'SIZE_L']
  },
  {
    menu_id: 5,
    name: '바닐라라떼',
    price: 5000,
    options: ['HOT', 'ICE', 'SIZE_S', 'SIZE_M', 'SIZE_L']
  }
];

class Menu {
  static async findAll() {
    if (USE_DUMMY_DATA || !dbConnected) {
      return DUMMY_MENUS;
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM menus ORDER BY menu_id ASC'
    );
    return rows;
  }

  static async findById(menuId) {
    if (USE_DUMMY_DATA || !dbConnected) {
      return DUMMY_MENUS.find(m => m.menu_id === menuId);
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM menus WHERE menu_id = ?',
      [menuId]
    );
    return rows[0];
  }

  static async create(menuData) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 메뉴를 생성할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    const { name, price, options } = menuData;
    const [result] = await pool.execute(
      'INSERT INTO menus (name, price, options) VALUES (?, ?, ?)',
      [name, price, JSON.stringify(options || [])]
    );
    return result.insertId;
  }

  static async update(menuId, menuData) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 메뉴를 수정할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    const { name, price, options } = menuData;
    await pool.execute(
      'UPDATE menus SET name = ?, price = ?, options = ? WHERE menu_id = ?',
      [name, price, JSON.stringify(options || []), menuId]
    );
    return menuId;
  }

  static async delete(menuId) {
    if (USE_DUMMY_DATA || !dbConnected) {
      throw new Error('더미 데이터 모드에서는 메뉴를 삭제할 수 없습니다. 데이터베이스를 설정해주세요.');
    }
    
    await pool.execute('DELETE FROM menus WHERE menu_id = ?', [menuId]);
    return menuId;
  }
}

module.exports = Menu;

