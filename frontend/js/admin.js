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
  setupInventoryEventDelegation();
  setupDeleteMenuEventDelegation();
  setupUpdateStatusEventDelegation();
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
  initAdminDOMCache();
  if (adminDOMCache.statTotal) adminDOMCache.statTotal.textContent = stats.total;
  if (adminDOMCache.statPending) adminDOMCache.statPending.textContent = stats.pending;
  if (adminDOMCache.statProcessing) adminDOMCache.statProcessing.textContent = stats.processing;
  if (adminDOMCache.statCompleted) adminDOMCache.statCompleted.textContent = stats.completed;
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

// 재고 카드 DOM 요소 생성
function createInventoryCardElement(menu) {
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
  
  const card = document.createElement('div');
  card.className = `inventory-card ${lowStock ? 'low-stock' : ''}`;
  card.setAttribute('data-menu-id', menu.menu_id);
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'inventory-card-name';
  nameDiv.textContent = displayName;
  
  const stockDiv = document.createElement('div');
  stockDiv.className = 'inventory-card-stock';
  stockDiv.textContent = `${stock}개`;
  
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'inventory-card-actions';
  
  const decreaseBtn = document.createElement('button');
  decreaseBtn.className = 'inventory-btn decrease';
  decreaseBtn.setAttribute('data-menu-id', menu.menu_id);
  decreaseBtn.setAttribute('data-action', 'decrease');
  decreaseBtn.textContent = '-';
  if (stock <= 0) decreaseBtn.disabled = true;
  
  const increaseBtn = document.createElement('button');
  increaseBtn.className = 'inventory-btn increase';
  increaseBtn.setAttribute('data-menu-id', menu.menu_id);
  increaseBtn.setAttribute('data-action', 'increase');
  increaseBtn.textContent = '+';
  
  actionsDiv.appendChild(decreaseBtn);
  actionsDiv.appendChild(increaseBtn);
  
  card.appendChild(nameDiv);
  card.appendChild(stockDiv);
  card.appendChild(actionsDiv);
  
  return card;
}

// 재고 현황 표시
function displayInventory(menus) {
  const inventoryList = document.getElementById('inventory-list');
  if (!inventoryList) return;
  
  // 기존 내용 제거
  inventoryList.textContent = '';
  
  if (menus.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = '등록된 메뉴가 없습니다.';
    inventoryList.appendChild(emptyMsg);
    return;
  }
  
  // DOM API를 사용하여 재고 카드 생성
  menus.forEach(menu => {
    const card = createInventoryCardElement(menu);
    inventoryList.appendChild(card);
  });
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

// 관리자 메뉴 카드 DOM 요소 생성
function createAdminMenuCardElement(menu) {
  const card = document.createElement('div');
  card.className = 'order-card';
  
  const header = document.createElement('div');
  header.className = 'order-header';
  
  const leftDiv = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = menu.name;
  const price = document.createElement('div');
  price.className = 'menu-price';
  price.textContent = `${menu.price.toLocaleString()}원`;
  leftDiv.appendChild(title);
  leftDiv.appendChild(price);
  
  const rightDiv = document.createElement('div');
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-danger';
  deleteBtn.setAttribute('data-menu-id', menu.menu_id);
  deleteBtn.setAttribute('data-action', 'delete-menu');
  deleteBtn.textContent = '삭제';
  rightDiv.appendChild(deleteBtn);
  
  header.appendChild(leftDiv);
  header.appendChild(rightDiv);
  
  const optionsDiv = document.createElement('div');
  const optionsP = document.createElement('p');
  const optionsStrong = document.createElement('strong');
  optionsStrong.textContent = '옵션: ';
  optionsP.appendChild(optionsStrong);
  optionsP.appendChild(document.createTextNode(menu.options.join(', ')));
  optionsDiv.appendChild(optionsP);
  
  card.appendChild(header);
  card.appendChild(optionsDiv);
  
  return card;
}

// 메뉴 관리 - 메뉴 목록 표시
function displayMenusAdmin(menus) {
  const menuList = document.getElementById('menu-list-admin');
  if (!menuList) return;

  // 기존 내용 제거
  menuList.textContent = '';

  if (menus.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = '등록된 메뉴가 없습니다.';
    menuList.appendChild(emptyMsg);
    return;
  }

  // DOM API를 사용하여 메뉴 카드 생성
  menus.forEach(menu => {
    const card = createAdminMenuCardElement(menu);
    menuList.appendChild(card);
  });
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

// 주문 항목 DOM 요소 생성
function createOrderItemElement(item) {
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
  
  const itemDiv = document.createElement('div');
  itemDiv.className = 'order-item-admin';
  itemDiv.textContent = `${menuName}${optionsText} x ${quantity}`;
  
  return itemDiv;
}

// 주문 카드 DOM 요소 생성
function createOrderCardElement(order) {
  const orderDate = new Date(order.created_at);
  const dateStr = orderDate.toLocaleDateString('ko-KR', { 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = orderDate.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
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

  const card = document.createElement('div');
  card.className = 'order-card-admin';
  card.setAttribute('data-order-status', order.status);
  
  const header = document.createElement('div');
  header.className = 'order-card-admin-header';
  
  const leftDiv = document.createElement('div');
  const dateTimeDiv = document.createElement('div');
  dateTimeDiv.className = 'order-date-time';
  dateTimeDiv.textContent = `${dateStr} ${timeStr}`;
  
  const itemsListDiv = document.createElement('div');
  itemsListDiv.className = 'order-items-list';
  order.items.forEach(item => {
    itemsListDiv.appendChild(createOrderItemElement(item));
  });
  
  const priceDiv = document.createElement('div');
  priceDiv.className = 'order-price';
  priceDiv.textContent = `${totalPrice.toLocaleString()}원`;
  
  leftDiv.appendChild(dateTimeDiv);
  leftDiv.appendChild(itemsListDiv);
  leftDiv.appendChild(priceDiv);
  
  const rightDiv = document.createElement('div');
  if (order.status !== '완료') {
    const button = document.createElement('button');
    button.className = buttonClass;
    button.setAttribute('data-order-id', order.order_id);
    button.setAttribute('data-action', 'update-status');
    button.setAttribute('data-next-status', getNextStatus(order.status));
    button.textContent = buttonText;
    rightDiv.appendChild(button);
  } else {
    const span = document.createElement('span');
    span.style.color = '#27ae60';
    span.style.fontWeight = 'bold';
    span.textContent = '완료됨';
    rightDiv.appendChild(span);
  }
  
  header.appendChild(leftDiv);
  header.appendChild(rightDiv);
  card.appendChild(header);
  
  return card;
}

// 주문 관리 - 주문 목록 표시
function displayOrdersAdmin(orders) {
  const ordersList = document.getElementById('orders-list-admin');
  if (!ordersList) return;

  // 기존 내용 제거
  ordersList.textContent = '';

  if (orders.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = '주문이 없습니다.';
    ordersList.appendChild(emptyMsg);
    return;
  }

  // 주문을 시간순으로 정렬 (최신순)
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // DOM API를 사용하여 주문 카드 생성
  sortedOrders.forEach(order => {
    const card = createOrderCardElement(order);
    ordersList.appendChild(card);
  });
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
    showError('주문 상태를 선택해주세요.');
    return;
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

// 주문 상태 업데이트 이벤트 위임 설정
let updateStatusHandlerAttached = false;
function setupUpdateStatusEventDelegation() {
  if (updateStatusHandlerAttached) return;
  updateStatusHandlerAttached = true;
  
  const ordersList = document.getElementById('orders-list-admin');
  if (ordersList) {
    ordersList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="update-status"]');
      if (btn && btn.dataset.orderId && btn.dataset.nextStatus) {
        const orderId = parseInt(btn.dataset.orderId);
        const newStatus = btn.dataset.nextStatus;
        updateOrderStatus(orderId, newStatus);
      }
    });
  }
}

// 전역 함수로 export (HTML에서 직접 호출하기 위해)
window.deleteMenu = deleteMenu;
window.updateOrderStatus = updateOrderStatus;
window.updateInventory = updateInventory;

