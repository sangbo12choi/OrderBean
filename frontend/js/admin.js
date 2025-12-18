// 관리자 관련 기능

// 설정 값 헬퍼 함수들
function getConfigValue(path, defaultValue) {
  if (typeof Config === 'undefined') return defaultValue;
  const keys = path.split('.');
  let value = Config;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  return value;
}

// 재고 데이터 관리 모듈 (모듈 패턴)
const InventoryManager = (function() {
  let inventoryData = {}; // private 변수

  return {
    // 재고 데이터 초기화
    init(menus) {
      const defaultStock = getConfigValue('INVENTORY.DEFAULT_STOCK', 10);
      menus.forEach(menu => {
        if (!inventoryData[menu.menu_id]) {
          inventoryData[menu.menu_id] = {
            menu_id: menu.menu_id,
            menu_name: menu.name,
            stock: defaultStock
          };
        }
      });
    },

    // 재고 데이터 가져오기
    get(menuId) {
      const defaultStock = getConfigValue('INVENTORY.DEFAULT_STOCK', 10);
      return inventoryData[menuId] || { stock: defaultStock };
    },

    // 재고 데이터 설정
    set(menuId, data) {
      inventoryData[menuId] = { ...inventoryData[menuId], ...data };
    },

    // 재고 수량 업데이트
    updateStock(menuId, change) {
      const defaultStock = getConfigValue('INVENTORY.DEFAULT_STOCK', 10);
      if (!inventoryData[menuId]) {
        inventoryData[menuId] = { menu_id: menuId, stock: defaultStock };
      }
      
      const newStock = inventoryData[menuId].stock + change;
      if (newStock < 0) {
        return { success: false, error: '재고는 0보다 작을 수 없습니다.' };
      }
      
      inventoryData[menuId].stock = newStock;
      return { success: true, stock: newStock };
    },

    // 모든 재고 데이터 가져오기
    getAll() {
      return { ...inventoryData };
    },

    // 재고 데이터 초기화
    clear() {
      inventoryData = {};
    }
  };
})();

// 메뉴 캐시 관리 모듈 (모듈 패턴)
const MenuCacheManager = (function() {
  let menusCache = {}; // private 변수

  return {
    // 메뉴 캐시에 추가
    set(menuId, menu) {
      menusCache[menuId] = menu;
    },

    // 메뉴 캐시에서 가져오기
    get(menuId) {
      return menusCache[menuId] || null;
    },

    // 여러 메뉴 일괄 추가
    setAll(menus) {
      menus.forEach(menu => {
        menusCache[menu.menu_id] = menu;
      });
    },

    // 모든 메뉴 캐시 가져오기
    getAll() {
      return { ...menusCache };
    },

    // 캐시가 비어있는지 확인
    isEmpty() {
      return Object.keys(menusCache).length === 0;
    },

    // 캐시 초기화
    clear() {
      menusCache = {};
    }
  };
})();

// 페이지 로드 시 초기화
if (document.getElementById('admin-section')) {
  initAdminDashboard();
}

// 관리자 대시보드 초기화
function initAdminDashboard() {
  // 대시보드 통계 로드
  loadDashboardStats();
  
  // 재고 현황 로드
  loadInventory();
  
  // 주문 현황 로드
  loadOrdersAdmin();
  
  // 통계 카드 클릭 이벤트
  initStatCards();
  
  // 탭 초기화
  initTabs();
  
  // 메뉴 등록 폼 이벤트
  const createMenuForm = document.getElementById('create-menu-form');
  if (createMenuForm) {
    createMenuForm.addEventListener('submit', (e) => {
      e.preventDefault();
      createMenu();
    });
  }
  
  // 주기적으로 데이터 새로고침
  const refreshInterval = getConfigValue('DASHBOARD.REFRESH_INTERVAL', 5000);
  setInterval(() => {
    loadDashboardStats();
    loadOrdersAdmin();
  }, refreshInterval);
}

// 대시보드 통계 로드
async function loadDashboardStats() {
  try {
    const data = await api.get('/orders');
    const orders = data.orders || [];
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === '접수').length,
      processing: orders.filter(o => o.status === '제조중').length,
      completed: orders.filter(o => o.status === '완료').length
    };
    
    updateDashboardStats(stats);
  } catch (error) {
    ErrorHandler.log(error, '대시보드 통계 로드');
  }
}

// 대시보드 통계 업데이트
function updateDashboardStats(stats) {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-pending').textContent = stats.pending;
  document.getElementById('stat-processing').textContent = stats.processing;
  document.getElementById('stat-completed').textContent = stats.completed;
}

// 통계 카드 클릭 이벤트 초기화
function initStatCards() {
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    card.addEventListener('click', () => {
      const status = card.dataset.status;
      filterOrdersByStatus(status);
    });
  });
}

// 주문 상태별 필터링
function filterOrdersByStatus(status) {
  const ordersList = document.getElementById('orders-list-admin');
  const allOrders = Array.from(ordersList.children);
  
  if (status === 'all') {
    allOrders.forEach(order => {
      order.style.display = 'block';
    });
  } else {
    allOrders.forEach(order => {
      const orderStatus = order.dataset.orderStatus;
      order.style.display = orderStatus === status ? 'block' : 'none';
    });
  }
}

// 재고 현황 로드
async function loadInventory() {
  try {
    const menuData = await api.get('/menus');
    const menus = menuData.menus || [];
    
    // 메뉴 캐시 저장
    MenuCacheManager.setAll(menus);
    
    // 재고 데이터 초기화 (실제로는 서버에서 가져와야 함)
    InventoryManager.init(menus);
    
    displayInventory(menus);
  } catch (error) {
    ErrorHandler.handle(error, '재고 정보 로드');
  }
}

// 재고 현황 표시
function displayInventory(menus) {
  const inventoryList = document.getElementById('inventory-list');
  if (!inventoryList) return;
  
  if (menus.length === 0) {
    inventoryList.innerHTML = '<p>등록된 메뉴가 없습니다.</p>';
    return;
  }
  
  inventoryList.innerHTML = menus.map(menu => {
    const inventory = InventoryManager.get(menu.menu_id);
    const stock = inventory.stock;
    const threshold = getConfigValue('INVENTORY.LOW_STOCK_THRESHOLD', 5);
    const lowStock = stock < threshold;
    
    // 메뉴명에 온도 표시
    const options = menu.options || [];
    const hasHot = options.includes('HOT');
    const hasIce = options.includes('ICE');
    let displayName = menu.name;
    if (hasHot && hasIce) {
      displayName = `${menu.name}(ICE)`;
    } else if (hasHot) {
      displayName = `${menu.name}(HOT)`;
    } else if (hasIce) {
      displayName = `${menu.name}(ICE)`;
    }
    
    return `
      <div class="inventory-card ${lowStock ? 'low-stock' : ''}" data-menu-id="${menu.menu_id}">
        <div class="inventory-card-name">${displayName}</div>
        <div class="inventory-card-stock">${stock}개</div>
        <div class="inventory-card-actions">
          <button class="inventory-btn decrease" onclick="updateInventory(${menu.menu_id}, -1)" ${stock <= 0 ? 'disabled' : ''}>-</button>
          <button class="inventory-btn increase" onclick="updateInventory(${menu.menu_id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join('');
}

// 재고 수량 업데이트
async function updateInventory(menuId, change) {
  const result = InventoryManager.updateStock(menuId, change);
  
  if (!result.success) {
    showError(result.error);
    return;
  }
  
  try {
    // 실제로는 서버 API 호출 필요
    // await api.put(`/admin/inventory/${menuId}`, { stock: result.stock });
    
    // UI 업데이트
    const menuData = await api.get('/menus');
    displayInventory(menuData.menus);
    
    showSuccess(`재고가 ${change > 0 ? '증가' : '감소'}되었습니다.`);
  } catch (error) {
    ErrorHandler.handle(error, '재고 업데이트');
  }
}

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
      const tabContent = document.getElementById(`${targetTab}-tab`);
      if (tabContent) {
        tabContent.classList.add('active');
      }

      // 탭별 데이터 로드
      if (targetTab === 'menus') {
        loadMenusAdmin();
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
    // 메뉴 정보가 없으면 먼저 로드
    if (MenuCacheManager.isEmpty()) {
      const menuData = await api.get('/menus');
      MenuCacheManager.setAll(menuData.menus);
    }
    
    const data = await api.get('/orders');
    displayOrdersAdmin(data.orders);
  } catch (error) {
    ErrorHandler.handle(error, '주문 목록 로드');
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

  // 주문을 시간순으로 정렬 (최신순)
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  ordersList.innerHTML = sortedOrders.map(order => {
    // 주문 날짜/시간 포맷팅
    const orderDate = new Date(order.created_at);
    const dateStr = orderDate.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric' 
    });
    const timeStr = orderDate.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // 주문 항목 표시
    const itemsHtml = order.items.map(item => {
      const menu = MenuCacheManager.get(item.menu_id);
      const menuName = menu ? menu.name : `메뉴 ID: ${item.menu_id}`;
      const options = item.options || {};
      
      // 옵션 텍스트 생성
      const extraOptions = [];
      if (options.temperature) {
        extraOptions.push(options.temperature);
      }
      if (options.shot) {
        extraOptions.push('샷 추가');
      }
      if (options.syrup) {
        extraOptions.push('시럽 추가');
      }
      
      const optionsText = extraOptions.length > 0 ? ` (${extraOptions.join(', ')})` : '';
      const quantity = item.quantity || 1;
      const itemPrice = menu ? menu.price : (item.price || 4000);
      
      return `
        <div class="order-item-admin">
          ${menuName}${optionsText} x ${quantity}
        </div>
      `;
    }).join('');

    // 총 가격 계산
    const totalPrice = order.total_price || order.items.reduce((sum, item) => {
      const menu = MenuCacheManager.get(item.menu_id);
      const itemPrice = menu ? menu.price : (item.price || 4000);
      const quantity = item.quantity || 1;
      return sum + itemPrice * quantity;
    }, 0);

    // 상태별 버튼 텍스트 및 클래스
    let buttonText = '주문 접수';
    let buttonClass = 'order-action-btn';
    
    if (order.status === '접수') {
      buttonText = '제조 시작';
      buttonClass += ' processing';
    } else if (order.status === '제조중') {
      buttonText = '제조 완료';
      buttonClass += ' completed';
    } else if (order.status === '완료') {
      buttonText = '완료됨';
      buttonClass += ' completed';
    }

    return `
      <div class="order-card-admin" data-order-status="${order.status}">
        <div class="order-card-admin-header">
          <div>
            <div class="order-date-time">${dateStr} ${timeStr}</div>
            <div class="order-items-list">
              ${itemsHtml}
            </div>
            <div class="order-price">${totalPrice.toLocaleString()}원</div>
          </div>
          <div>
            ${order.status !== '완료' 
              ? `<button class="${buttonClass}" onclick="updateOrderStatus(${order.order_id}, '${getNextStatus(order.status)}')">${buttonText}</button>`
              : '<span style="color: #27ae60; font-weight: bold;">완료됨</span>'
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 다음 상태 반환
function getNextStatus(currentStatus) {
  const statusFlow = {
    '접수': '제조중',
    '제조중': '완료',
    '완료': '완료'
  };
  return statusFlow[currentStatus] || '접수';
}

// 주문 상태 변경
async function updateOrderStatus(orderId, newStatus) {
  if (!newStatus) {
    // 기존 방식 지원 (select에서 가져오기)
    const select = document.getElementById(`status-select-${orderId}`);
    if (select) {
      newStatus = select.value;
    } else {
      showError('주문 상태를 선택해주세요.');
      return;
    }
  }

  try {
    await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
    showSuccess('주문 상태가 변경되었습니다.');
    
    // 대시보드 통계 및 주문 목록 새로고침
    loadDashboardStats();
    loadOrdersAdmin();
  } catch (error) {
    ErrorHandler.handle(error, '주문 상태 변경');
  }
}

// 전역 함수로 export (HTML에서 직접 호출하기 위해)
window.deleteMenu = deleteMenu;
window.updateOrderStatus = updateOrderStatus;
window.updateInventory = updateInventory;

