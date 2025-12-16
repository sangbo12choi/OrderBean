const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 메뉴 관리
router.post('/menus', adminController.createMenu);
router.put('/menus/:id', adminController.updateMenu);
router.delete('/menus/:id', adminController.deleteMenu);

// 주문 상태 관리
router.put('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;

