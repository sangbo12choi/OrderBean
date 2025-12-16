// 메뉴 관련 기능

let currentSelectedMenu = null;
let currentOrderOptions = {};

// 메뉴 목록 로드
async function loadMenus() {
  try {
    const data = await api.get('/menus');
    displayMenus(data.menus);
  } catch (error) {
    showError('메뉴를 불러오는 중 오류가 발생했습니다.');
  }
}

// 메뉴 표시
function displayMenus(menus) {
  const menuList = document.getElementById('menu-list');
  if (!menuList) return;

  if (menus.length === 0) {
    menuList.innerHTML = '<p>등록된 메뉴가 없습니다.</p>';
    return;
  }

  menuList.innerHTML = menus.map(menu => `
    <div class="menu-item" data-menu-id="${menu.menu_id}">
      <h3>${menu.name}</h3>
      <div class="menu-price">${menu.price.toLocaleString()}원</div>
      <div class="menu-options">
        옵션: ${menu.options.join(', ')}
      </div>
    </div>
  `).join('');

  // 메뉴 클릭 이벤트
  menuList.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const menuId = parseInt(item.dataset.menuId);
      const menu = menus.find(m => m.menu_id === menuId);
      selectMenu(menu);
    });
  });
}

// 메뉴 선택
function selectMenu(menu) {
  currentSelectedMenu = menu;
  currentOrderOptions = {};

  // 주문 섹션 표시
  const orderSection = document.getElementById('order-section');
  const menuSection = document.getElementById('menu-section');
  
  if (orderSection && menuSection) {
    orderSection.classList.remove('hidden');
    menuSection.classList.add('hidden');
  }

  // 선택된 메뉴 표시
  const selectedMenuDiv = document.getElementById('selected-menu');
  if (selectedMenuDiv) {
    selectedMenuDiv.innerHTML = `
      <h3>${menu.name}</h3>
      <div class="menu-price">${menu.price.toLocaleString()}원</div>
    `;
  }

  // 옵션 폼 생성
  renderOptionsForm(menu);
  updateOrderSummary();
}

// 옵션 폼 렌더링
function renderOptionsForm(menu) {
  const optionsForm = document.getElementById('options-form');
  if (!optionsForm) return;

  const options = menu.options || [];
  const optionGroups = {
    temperature: options.filter(opt => opt === 'HOT' || opt === 'ICE'),
    size: options.filter(opt => opt.startsWith('SIZE_'))
  };

  let html = '';

  if (optionGroups.temperature.length > 0) {
    html += `
      <div class="option-group">
        <label>온도</label>
        <div class="option-buttons">
          ${optionGroups.temperature.map(opt => `
            <button type="button" class="option-btn" data-option="temperature" data-value="${opt}">
              ${opt === 'HOT' ? '🔥 HOT' : '🧊 ICE'}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (optionGroups.size.length > 0) {
    html += `
      <div class="option-group">
        <label>사이즈</label>
        <div class="option-buttons">
          ${optionGroups.size.map(opt => {
            const sizeMap = {
              'SIZE_S': 'S',
              'SIZE_M': 'M',
              'SIZE_L': 'L'
            };
            return `
              <button type="button" class="option-btn" data-option="size" data-value="${opt}">
                ${sizeMap[opt] || opt}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  optionsForm.innerHTML = html;

  // 옵션 버튼 클릭 이벤트
  optionsForm.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const option = btn.dataset.option;
      const value = btn.dataset.value;

      // 같은 그룹의 다른 버튼 선택 해제
      optionsForm.querySelectorAll(`[data-option="${option}"]`).forEach(b => {
        b.classList.remove('selected');
      });

      // 현재 버튼 선택
      btn.classList.add('selected');
      currentOrderOptions[option] = value;
      updateOrderSummary();
    });
  });
}

// 주문 요약 업데이트
function updateOrderSummary() {
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv || !currentSelectedMenu) return;

  const optionsText = Object.entries(currentOrderOptions)
    .map(([key, value]) => {
      const keyMap = {
        temperature: '온도',
        size: '사이즈'
      };
      return `${keyMap[key] || key}: ${value}`;
    })
    .join(', ');

  summaryDiv.innerHTML = `
    <h4>주문 요약</h4>
    <p><strong>메뉴:</strong> ${currentSelectedMenu.name}</p>
    <p><strong>가격:</strong> ${currentSelectedMenu.price.toLocaleString()}원</p>
    ${optionsText ? `<p><strong>옵션:</strong> ${optionsText}</p>` : ''}
  `;
}

// 주문 취소
function cancelOrder() {
  currentSelectedMenu = null;
  currentOrderOptions = {};

  const orderSection = document.getElementById('order-section');
  const menuSection = document.getElementById('menu-section');
  
  if (orderSection && menuSection) {
    orderSection.classList.add('hidden');
    menuSection.classList.remove('hidden');
  }
}

// 페이지 로드 시 메뉴 로드
if (document.getElementById('menu-list')) {
  loadMenus();
}

// 취소 버튼 이벤트
const cancelBtn = document.getElementById('cancel-order');
if (cancelBtn) {
  cancelBtn.addEventListener('click', cancelOrder);
}

