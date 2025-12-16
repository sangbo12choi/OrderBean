const Menu = require('../models/Menu');
const Order = require('../models/Order');

const adminController = {
  // POST /api/admin/menus - 메뉴 등록
  async createMenu(req, res) {
    try {
      const { name, price, options } = req.body;

      if (!name || !price) {
        return res.status(400).json({ 
          error: 'name과 price는 필수입니다.' 
        });
      }

      const menuId = await Menu.create({ name, price, options });

      res.status(201).json({
        menu_id: menuId,
        message: '메뉴가 등록되었습니다.'
      });
    } catch (error) {
      console.error('Error creating menu:', error);
      res.status(500).json({ 
        error: '메뉴 등록 중 오류가 발생했습니다.',
        message: error.message 
      });
    }
  },

  // PUT /api/admin/menus/:id - 메뉴 수정
  async updateMenu(req, res) {
    try {
      const { id } = req.params;
      const { name, price, options } = req.body;

      await Menu.update(id, { name, price, options });

      res.json({
        menu_id: id,
        message: '메뉴가 수정되었습니다.'
      });
    } catch (error) {
      console.error('Error updating menu:', error);
      res.status(500).json({ 
        error: '메뉴 수정 중 오류가 발생했습니다.',
        message: error.message 
      });
    }
  },

  // DELETE /api/admin/menus/:id - 메뉴 삭제
  async deleteMenu(req, res) {
    try {
      const { id } = req.params;

      await Menu.delete(id);

      res.json({
        menu_id: id,
        message: '메뉴가 삭제되었습니다.'
      });
    } catch (error) {
      console.error('Error deleting menu:', error);
      res.status(500).json({ 
        error: '메뉴 삭제 중 오류가 발생했습니다.',
        message: error.message 
      });
    }
  },

  // PUT /api/admin/orders/:id/status - 주문 상태 변경
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ 
          error: 'status는 필수입니다.' 
        });
      }

      const validStatuses = ['접수', '제조중', '완료'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: `status는 ${validStatuses.join(', ')} 중 하나여야 합니다.` 
        });
      }

      await Order.updateStatus(id, status);

      res.json({
        order_id: id,
        status: status,
        message: '주문 상태가 변경되었습니다.'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ 
        error: '주문 상태 변경 중 오류가 발생했습니다.',
        message: error.message 
      });
    }
  }
};

module.exports = adminController;

