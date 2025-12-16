const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const orderController = {
  // POST /api/orders - 주문 생성
  async createOrder(req, res) {
    try {
      const { user_id, items } = req.body;

      if (!user_id || !items || items.length === 0) {
        return res.status(400).json({ 
          error: 'user_id와 items는 필수입니다.' 
        });
      }

      // 주문 생성
      const orderId = await Order.create({ user_id, status: '접수' });

      // 주문 항목 생성
      const orderItems = items.map(item => ({
        order_id: orderId,
        menu_id: item.menu_id,
        options: item.options || {}
      }));

      await OrderItem.createMultiple(orderItems);

      const order = await Order.findById(orderId);

      res.status(201).json({
        order_id: order.order_id,
        status: order.status,
        created_at: order.created_at
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ 
        error: '주문 생성 중 오류가 발생했습니다.',
        message: error.message 
      });
    }
  },

  // GET /api/orders - 주문 내역 조회
  async getOrders(req, res) {
    try {
      const { user_id } = req.query;

      let orders;
      if (user_id) {
        orders = await Order.findByUserId(user_id);
      } else {
        orders = await Order.findAll();
      }

      // 각 주문의 항목 정보 포함
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.findByOrderId(order.order_id);
          return {
            ...order,
            items: items.map(item => ({
              ...item,
              options: typeof item.options === 'string' 
                ? JSON.parse(item.options) 
                : item.options
            }))
          };
        })
      );

      res.json({ orders: ordersWithItems });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ 
        error: '주문 내역 조회 중 오류가 발생했습니다.',
        message: error.message 
      });
    }
  }
};

module.exports = orderController;

