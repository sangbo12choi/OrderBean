// 주문 관련 기능

// 주문 생성
async function createOrder(userId = 1) {
  if (!currentSelectedMenu) {
    showError('메뉴를 선택해주세요.');
    return;
  }

  // 필수 옵션 확인
  const requiredOptions = ['temperature', 'size'];
  const missingOptions = requiredOptions.filter(opt => !currentOrderOptions[opt]);
  
  if (missingOptions.length > 0) {
    showError('모든 옵션을 선택해주세요.');
    return;
  }

  try {
    const orderData = {
      user_id: userId,
      items: [
        {
          menu_id: currentSelectedMenu.menu_id,
          options: currentOrderOptions
        }
      ]
    };

    const result = await api.post('/orders', orderData);
    showSuccess(`주문이 접수되었습니다! 주문번호: ${result.order_id}`);
    
    // 주문 완료 후 초기화
    cancelOrder();
    loadMenus(); // 메뉴 목록 새로고침
  } catch (error) {
    showError('주문 생성 중 오류가 발생했습니다.');
  }
}

// 주문 내역 로드
async function loadOrders(userId) {
  try {
    const data = await api.get(`/orders?user_id=${userId}`);
    displayOrders(data.orders);
  } catch (error) {
    showError('주문 내역을 불러오는 중 오류가 발생했습니다.');
  }
}

// 주문 내역 표시
function displayOrders(orders) {
  const ordersList = document.getElementById('orders-list');
  if (!ordersList) return;

  if (orders.length === 0) {
    ordersList.innerHTML = '<p>주문 내역이 없습니다.</p>';
    return;
  }

  ordersList.innerHTML = orders.map(order => {
    const itemsHtml = order.items.map(item => {
      const optionsText = Object.entries(item.options || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      return `
        <div class="order-item">
          <strong>메뉴 ID:</strong> ${item.menu_id}
          ${optionsText ? `<br><strong>옵션:</strong> ${optionsText}` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <span class="order-id">주문 #${order.order_id}</span>
            <span style="margin-left: 1rem; color: #666;">
              ${new Date(order.created_at).toLocaleString('ko-KR')}
            </span>
          </div>
          <span class="order-status ${order.status}">${order.status}</span>
        </div>
        <div class="order-items">
          ${itemsHtml}
        </div>
      </div>
    `;
  }).join('');
}

// 주문 내역 페이지 이벤트
if (document.getElementById('load-orders')) {
  const loadBtn = document.getElementById('load-orders');
  const userIdInput = document.getElementById('user-id');

  loadBtn.addEventListener('click', () => {
    const userId = parseInt(userIdInput.value) || 1;
    loadOrders(userId);
  });

  // 페이지 로드 시 기본 사용자 주문 내역 로드
  loadOrders(1);
}

// 주문하기 버튼 이벤트는 menu.js에서 처리됨

