const Menu = require('../models/Menu');

const menuController = {
  // GET /api/menus - 메뉴 조회
  async getMenus(req, res) {
    try {
      const menus = await Menu.findAll();
      
      if (!menus || menus.length === 0) {
        return res.json({ menus: [] });
      }
      
      // JSON 문자열을 파싱
      const formattedMenus = menus.map(menu => ({
        menu_id: menu.menu_id,
        name: menu.name,
        price: menu.price,
        options: typeof menu.options === 'string' 
          ? JSON.parse(menu.options) 
          : (Array.isArray(menu.options) ? menu.options : [])
      }));

      res.json({ menus: formattedMenus });
    } catch (error) {
      console.error('Error fetching menus:', error);
      res.status(500).json({ 
        error: '메뉴 조회 중 오류가 발생했습니다.',
        message: error.message,
        hint: '데이터베이스 연결을 확인하거나 .env 파일에 USE_DUMMY_DATA=true를 추가하세요.'
      });
    }
  }
};

module.exports = menuController;

