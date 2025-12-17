// 메뉴 관련 기능

let cart = []; // 장바구니 배열

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

  menuList.innerHTML = menus.map(menu => {
    // 옵션 파싱
    const options = menu.options || [];
    const hasHot = options.includes('HOT');
    const hasIce = options.includes('ICE');
    
    // 모든 메뉴에 기본적으로 샷 추가와 시럽 추가 옵션 제공 (이미지 목업에 맞춤)
    const hasShot = true; // 항상 표시
    const hasSyrup = true; // 항상 표시

    // 메뉴명에 온도 표시 (이미지 목업 스타일)
    let menuDisplayName = menu.name;
    if (hasHot && hasIce) {
      // HOT과 ICE 둘 다 있으면 기본값으로 HOT 표시 (이미지 목업에서는 ICE가 먼저 나옴)
      menuDisplayName = `${menu.name}(ICE)`;
    } else if (hasHot) {
      menuDisplayName = `${menu.name}(HOT)`;
    } else if (hasIce) {
      menuDisplayName = `${menu.name}(ICE)`;
    }

    // 온도 옵션 생성 (라디오 버튼)
    let temperatureOptions = '';
    if (hasHot || hasIce) {
      temperatureOptions = `
        <div class="option-checkbox">
          <input type="radio" name="temp-${menu.menu_id}" id="hot-${menu.menu_id}" value="HOT" ${hasHot && !hasIce ? 'checked' : hasHot && hasIce ? '' : ''}>
          <label for="hot-${menu.menu_id}">HOT</label>
        </div>
        <div class="option-checkbox">
          <input type="radio" name="temp-${menu.menu_id}" id="ice-${menu.menu_id}" value="ICE" ${hasIce && !hasHot ? 'checked' : hasHot && hasIce ? 'checked' : ''}>
          <label for="ice-${menu.menu_id}">ICE</label>
        </div>
      `;
    }

    // 추가 옵션 생성 (체크박스)
    let extraOptions = '';
    if (hasShot) {
      extraOptions += `
        <div class="option-checkbox">
          <input type="checkbox" id="shot-${menu.menu_id}" value="샷 추가" data-price="500">
          <label for="shot-${menu.menu_id}">샷 추가 (+500원)</label>
        </div>
      `;
    }
    if (hasSyrup) {
      extraOptions += `
        <div class="option-checkbox">
          <input type="checkbox" id="syrup-${menu.menu_id}" value="시럽 추가" data-price="0">
          <label for="syrup-${menu.menu_id}">시럽 추가 (+0원)</label>
        </div>
      `;
    }

    return `
      <div class="menu-item" data-menu-id="${menu.menu_id}">
        <div class="menu-image"></div>
        <h3>${menuDisplayName}</h3>
        <div class="menu-price">${menu.price.toLocaleString()}원</div>
        <div class="menu-description">간단한 설명...</div>
        <div class="menu-options">
          ${temperatureOptions}
          ${extraOptions}
        </div>
        <button class="add-to-cart-btn" data-menu-id="${menu.menu_id}">담기</button>
      </div>
    `;
  }).join('');

  // 담기 버튼 이벤트
  menuList.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menuId = parseInt(btn.dataset.menuId);
      const menu = menus.find(m => m.menu_id === menuId);
      if (menu) {
        addToCart(menu, menuId);
      }
    });
  });
}

// 장바구니에 추가
function addToCart(menu, menuId) {
  // 선택된 옵션 가져오기
  const temperature = document.querySelector(`input[name="temp-${menuId}"]:checked`);
  const shot = document.getElementById(`shot-${menuId}`);
  const syrup = document.getElementById(`syrup-${menuId}`);

  const options = [];
  let additionalPrice = 0;
  let displayName = menu.name;

  // 온도 옵션
  if (temperature) {
    const tempValue = temperature.value;
    options.push(tempValue);
    displayName = `${menu.name}(${tempValue})`;
  }

  // 추가 옵션
  if (shot && shot.checked) {
    options.push('샷 추가');
    additionalPrice += parseInt(shot.dataset.price || 0);
  }
  if (syrup && syrup.checked) {
    options.push('시럽 추가');
    additionalPrice += parseInt(syrup.dataset.price || 0);
  }

  const item = {
    menu_id: menu.menu_id,
    name: menu.name,
    displayName: displayName,
    basePrice: menu.price,
    options: options.sort(), // 옵션을 정렬하여 비교 정확도 향상
    additionalPrice: additionalPrice,
    quantity: 1,
    totalPrice: menu.price + additionalPrice
  };

  // 장바구니에 동일한 아이템이 있는지 확인 (메뉴 ID와 옵션이 모두 동일한 경우)
  const existingIndex = cart.findIndex(cartItem => {
    // 메뉴 ID가 같고
    if (cartItem.menu_id !== item.menu_id) return false;
    
    // 옵션 배열을 정렬하여 비교
    const cartOptions = [...cartItem.options].sort();
    const itemOptions = [...item.options].sort();
    
    // 배열 길이가 다르면 다른 아이템
    if (cartOptions.length !== itemOptions.length) return false;
    
    // 모든 옵션이 동일한지 확인
    return cartOptions.every((opt, idx) => opt === itemOptions[idx]);
  });

  if (existingIndex >= 0) {
    // 동일한 아이템이 있으면 수량 증가
    cart[existingIndex].quantity += 1;
    cart[existingIndex].totalPrice = (cart[existingIndex].basePrice + cart[existingIndex].additionalPrice) * cart[existingIndex].quantity;
    showSuccess('장바구니에 추가되었습니다. (수량: ' + cart[existingIndex].quantity + '개)');
  } else {
    // 새로운 아이템 추가
    cart.push(item);
    showSuccess('장바구니에 추가되었습니다.');
  }

  updateCart();
}

// 장바구니 업데이트
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalAmount = document.getElementById('total-amount');
  const submitOrderBtn = document.getElementById('submit-order');

  if (!cartItems || !totalAmount) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">장바구니가 비어있습니다.</p>';
    totalAmount.textContent = '0원';
    submitOrderBtn.disabled = true;
    return;
  }

  submitOrderBtn.disabled = false;

  // 장바구니가 비어있으면 빈 메시지 표시
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">장바구니가 비어있습니다.</p>';
    totalAmount.textContent = '0원';
    submitOrderBtn.disabled = true;
    return;
  }

  submitOrderBtn.disabled = false;

  // 동일한 메뉴와 옵션을 가진 아이템들을 그룹화하여 표시
  cartItems.innerHTML = cart.map((item, index) => {
    // 옵션 텍스트 생성 (이미지 목업 스타일)
    const extraOptions = item.options.filter(opt => opt !== 'HOT' && opt !== 'ICE');
    const optionsText = extraOptions.length > 0 ? ` (${extraOptions.join(', ')})` : '';
    const displayName = item.displayName || item.name;
    const itemTotalPrice = (item.basePrice + item.additionalPrice) * item.quantity;
    
    return `
      <div class="cart-item">
        <span class="cart-item-name">${displayName}${optionsText} X ${item.quantity}</span>
        <span class="cart-item-price">${itemTotalPrice.toLocaleString()}원</span>
      </div>
    `;
  }).join('');

  const total = cart.reduce((sum, item) => {
    return sum + ((item.basePrice + item.additionalPrice) * item.quantity);
  }, 0);

  totalAmount.textContent = `${total.toLocaleString()}원`;
}

// 주문하기
async function submitOrder() {
  if (cart.length === 0) {
    showError('장바구니가 비어있습니다.');
    return;
  }

  try {
    const orderItems = cart.map(item => {
      const optionsObj = {};
      item.options.forEach(opt => {
        if (opt === 'HOT' || opt === 'ICE') {
          optionsObj.temperature = opt;
        } else if (opt === '샷 추가') {
          optionsObj.shot = true;
        } else if (opt === '시럽 추가') {
          optionsObj.syrup = true;
        }
      });
      return {
        menu_id: item.menu_id,
        options: optionsObj
      };
    });

    const response = await api.post('/orders', {
      user_id: 1, // 임시 사용자 ID
      items: orderItems
    });

    showSuccess('주문이 완료되었습니다!');
    cart = [];
    updateCart();
  } catch (error) {
    showError('주문 처리 중 오류가 발생했습니다.');
    console.error(error);
  }
}

// 페이지 로드 시 메뉴 로드
if (document.getElementById('menu-list')) {
  loadMenus();
}

// 주문하기 버튼 이벤트
const submitOrderBtn = document.getElementById('submit-order');
if (submitOrderBtn) {
  submitOrderBtn.addEventListener('click', submitOrder);
}

