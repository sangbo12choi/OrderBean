// 관리자 관련 기능

// 탭 전환
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // 모든 탭 버튼 비활성화
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // 선택된 탭 활성화
      btn.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');

      // 탭별 데이터 로드
      if (targetTab === 'menus') {
        loadMenusAdmin();
      } else if (targetTab === 'orders') {
        loadOrdersAdmin();
      }
    });
  });
}

// 메뉴 관리 - 메뉴 목록 로드
async function loadMenusAdmin() {
  try {
    const data = await api.get('/menus');
    displayMenusAdmin(data.menus);
  } catch (error) {
    showError('메뉴를 불러오는 중 오류가 발생했습니다.');
  }
}

// 메뉴 관리 - 메뉴 목록 표시
function displayMenusAdmin(menus) {
  const menuList = document.getElementById('menu-list-admin');
  if (!menuList) return;

  if (menus.length === 0) {
    menuList.innerHTML = '<p>등록된 메뉴가 없습니다.</p>';
    return;
  }

  menuList.innerHTML = menus.map(menu => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <h3>${menu.name}</h3>
          <div class="menu-price">${menu.price.toLocaleString()}원</div>
        </div>
        <div>
          <button class="btn-danger" onclick="deleteMenu(${menu.menu_id})">삭제</button>
        </div>
      </div>
      <div>
        <p><strong>옵션:</strong> ${menu.options.join(', ')}</p>
      </div>
    </div>
  `).join('');
}

// 메뉴 등록
async function createMenu() {
  const name = document.getElementById('menu-name').value;
  const price = parseInt(document.getElementById('menu-price').value);
  const optionsText = document.getElementById('menu-options').value;

  if (!name || !price) {
    showError('메뉴 이름과 가격을 입력해주세요.');
    return;
  }

  let options = [];
  if (optionsText.trim()) {
    try {
      options = JSON.parse(optionsText);
    } catch (error) {
      showError('옵션 형식이 올바르지 않습니다. JSON 배열 형식으로 입력해주세요.');
      return;
    }
  }

  try {
    await api.post('/admin/menus', { name, price, options });
    showSuccess('메뉴가 등록되었습니다.');
    
    // 폼 초기화
    document.getElementById('create-menu-form').reset();
    
    // 메뉴 목록 새로고침
    loadMenusAdmin();
  } catch (error) {
    showError('메뉴 등록 중 오류가 발생했습니다.');
  }
}

// 메뉴 삭제
async function deleteMenu(menuId) {
  if (!confirm('정말 이 메뉴를 삭제하시겠습니까?')) {
    return;
  }

  try {
    await api.delete(`/admin/menus/${menuId}`);
    showSuccess('메뉴가 삭제되었습니다.');
    loadMenusAdmin();
  } catch (error) {
    showError('메뉴 삭제 중 오류가 발생했습니다.');
  }
}

// 주문 관리 - 주문 목록 로드
async function loadOrdersAdmin() {
  try {
    const data = await api.get('/orders');
    displayOrdersAdmin(data.orders);
  } catch (error) {
    showError('주문 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 주문 관리 - 주문 목록 표시
function displayOrdersAdmin(orders) {
  const ordersList = document.getElementById('orders-list-admin');
  if (!ordersList) return;

  if (orders.length === 0) {
    ordersList.innerHTML = '<p>주문이 없습니다.</p>';
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

    const statusOptions = ['접수', '제조중', '완료'];
    const statusSelect = statusOptions.map(status => 
      `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`
    ).join('');

    return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <span class="order-id">주문 #${order.order_id}</span>
            <span style="margin-left: 1rem; color: #666;">
              사용자 ID: ${order.user_id}
            </span>
            <span style="margin-left: 1rem; color: #666;">
              ${new Date(order.created_at).toLocaleString('ko-KR')}
            </span>
          </div>
          <div>
            <select id="status-select-${order.order_id}" class="order-status-select">
              ${statusSelect}
            </select>
            <button class="btn-primary" onclick="updateOrderStatus(${order.order_id})">
              상태 변경
            </button>
          </div>
        </div>
        <div class="order-items">
          ${itemsHtml}
        </div>
      </div>
    `;
  }).join('');
}

// 주문 상태 변경
async function updateOrderStatus(orderId) {
  const select = document.getElementById(`status-select-${orderId}`);
  const status = select.value;

  try {
    await api.put(`/admin/orders/${orderId}/status`, { status });
    showSuccess('주문 상태가 변경되었습니다.');
    loadOrdersAdmin();
  } catch (error) {
    showError('주문 상태 변경 중 오류가 발생했습니다.');
  }
}

// 페이지 로드 시 초기화
if (document.getElementById('admin-section')) {
  initTabs();
  
  // 메뉴 등록 폼 이벤트
  const createMenuForm = document.getElementById('create-menu-form');
  if (createMenuForm) {
    createMenuForm.addEventListener('submit', (e) => {
      e.preventDefault();
      createMenu();
    });
  }

  // 초기 탭 데이터 로드
  loadMenusAdmin();
}

// 전역 함수로 export (HTML에서 직접 호출하기 위해)
window.deleteMenu = deleteMenu;
window.updateOrderStatus = updateOrderStatus;

