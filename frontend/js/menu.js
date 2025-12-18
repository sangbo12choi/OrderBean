// 메뉴 관련 기능

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

// 장바구니 관리 모듈 (모듈 패턴)
const CartManager = (function() {
  let cart = []; // private 변수

  return {
    // 장바구니에 아이템 추가
    add(item) {
      // 동일한 아이템이 있는지 확인
      const existingIndex = cart.findIndex(cartItem => {
        if (cartItem.menu_id !== item.menu_id) return false;
        
        const cartOptions = [...cartItem.options].sort();
        const itemOptions = [...item.options].sort();
        
        if (cartOptions.length !== itemOptions.length) return false;
        return cartOptions.every((opt, idx) => opt === itemOptions[idx]);
      });

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
        cart[existingIndex].totalPrice = (cart[existingIndex].basePrice + cart[existingIndex].additionalPrice) * cart[existingIndex].quantity;
        return { added: true, existing: true, quantity: cart[existingIndex].quantity };
      } else {
        cart.push(item);
        return { added: true, existing: false, quantity: 1 };
      }
    },

    // 장바구니에서 아이템 제거
    remove(index) {
      if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        return true;
      }
      return false;
    },

    // 장바구니 비우기
    clear() {
      cart = [];
    },

    // 장바구니 전체 가져오기 (복사본 반환)
    getAll() {
      return [...cart];
    },

    // 장바구니 아이템 개수
    getCount() {
      return cart.length;
    },

    // 장바구니가 비어있는지 확인
    isEmpty() {
      return cart.length === 0;
    },

    // 총 금액 계산
    getTotal() {
      return cart.reduce((sum, item) => {
        return sum + ((item.basePrice + item.additionalPrice) * item.quantity);
      }, 0);
    }
  };
})();

// 이미지 경로 결정 함수
function getMenuImagePath(menuName, temperature, defaultTemp) {
  const menuNameLower = menuName.toLowerCase();
  const temp = temperature || defaultTemp || 'ICE';
  
  // 아메리카노
  if (menuNameLower.includes('아메리카노') || menuNameLower.includes('americano')) {
    return temp === 'ICE' ? '/images/americano-ice.jpg' : '/images/americano-hot.jpg';
  }
  // 카페라떼
  else if (menuNameLower.includes('카페라떼') || menuNameLower.includes('cafe latte') || 
           (menuNameLower.includes('라떼') && !menuNameLower.includes('바닐라') && !menuNameLower.includes('vanilla'))) {
    return temp === 'ICE' ? '/images/latte-ice.jpg' : '/images/latte-hot.jpg';
  }
  // 카푸치노
  else if (menuNameLower.includes('카푸치노') || menuNameLower.includes('cappuccino')) {
    return temp === 'ICE' ? '/images/cappuccino-ice.jpg' : '/images/cappuccino-hot.jpg';
  }
  // 카라멜 마키아토
  else if (menuNameLower.includes('카라멜') || menuNameLower.includes('caramel') || 
           menuNameLower.includes('마키아토') || menuNameLower.includes('macchiato')) {
    return temp === 'ICE' ? '/images/caramel-macchiato-ice.jpg' : '/images/caramel-macchiato-hot.jpg';
  }
  // 바닐라라떼
  else if (menuNameLower.includes('바닐라') || menuNameLower.includes('vanilla')) {
    return temp === 'ICE' ? '/images/vanilla-latte-ice.jpg' : '/images/vanilla-latte-hot.jpg';
  }
  // 에스프레소 (HOT만)
  else if (menuNameLower.includes('에스프레소') || menuNameLower.includes('espresso')) {
    return '/images/espresso-hot.jpg';
  }
  // 콜드브루 (ICE만)
  else if (menuNameLower.includes('콜드브루') || menuNameLower.includes('cold brew') || menuNameLower.includes('coldbrew')) {
    return '/images/cold-brew-ice.jpg';
  }
  // 기본 이미지
  else {
    return '/images/default-coffee.jpg';
  }
}

// 메뉴 옵션 파싱 (utils.js의 공통 함수 사용)
function parseMenuOptions(menu) {
  if (typeof window.parseMenuOptions === 'function') {
    return window.parseMenuOptions(menu);
  }
  // 폴백 (utils.js가 로드되지 않은 경우)
  const options = menu.options || [];
  return {
    hasHot: options.includes('HOT'),
    hasIce: options.includes('ICE'),
    hasShot: true,
    hasSyrup: true
  };
}

// 메뉴 표시명 생성 (utils.js의 공통 함수 사용)
function createMenuDisplayName(menuName, hasHot, hasIce) {
  if (typeof window.formatMenuNameWithTemperature === 'function') {
    const options = [];
    if (hasHot) options.push('HOT');
    if (hasIce) options.push('ICE');
    return window.formatMenuNameWithTemperature(menuName, options);
  }
  // 폴백
  if (hasHot && hasIce) {
    return `${menuName}(ICE)`;
  } else if (hasHot) {
    return `${menuName}(HOT)`;
  } else if (hasIce) {
    return `${menuName}(ICE)`;
  }
  return menuName;
}

// 초기 온도 결정
function determineInitialTemperature(hasHot, hasIce) {
  if (hasHot && !hasIce) {
    return 'HOT';
  } else if (hasIce && !hasHot) {
    return 'ICE';
  } else if (hasHot && hasIce) {
    return 'ICE'; // 기본값
  }
  return 'ICE'; // 기본값
}

// 메뉴 가격 계산
function calculateMenuPrice(basePrice, temperature) {
  const icePrice = getConfigValue('PRICING.ICE_ADDITIONAL_PRICE', 500);
  return temperature === 'ICE' ? basePrice + icePrice : basePrice;
}

// 온도 옵션 HTML 생성
function createTemperatureOptionsHTML(menuId, hasHot, hasIce) {
  if (!hasHot && !hasIce) return '';
  
  const hotChecked = hasHot && !hasIce ? 'checked' : '';
  const iceChecked = hasIce && !hasHot ? 'checked' : (hasHot && hasIce ? 'checked' : '');
  
  return `
    <div class="option-checkbox">
      <input type="radio" name="temp-${menuId}" id="hot-${menuId}" value="HOT" ${hotChecked}>
      <label for="hot-${menuId}">HOT</label>
    </div>
    <div class="option-checkbox">
      <input type="radio" name="temp-${menuId}" id="ice-${menuId}" value="ICE" ${iceChecked}>
      <label for="ice-${menuId}">ICE</label>
    </div>
  `;
}

// 추가 옵션 HTML 생성
function createExtraOptionsHTML(menuId, hasShot, hasSyrup) {
  let html = '';
  
  if (hasShot) {
    const shotPrice = getConfigValue('PRICING.SHOT_ADDITIONAL_PRICE', 500);
    html += `
      <div class="option-checkbox">
        <input type="checkbox" id="shot-${menuId}" value="샷 추가" data-price="${shotPrice}">
        <label for="shot-${menuId}">샷 추가 (+${shotPrice.toLocaleString()}원)</label>
      </div>
    `;
  }
  
  if (hasSyrup) {
    html += `
      <div class="option-checkbox">
        <input type="checkbox" id="syrup-${menuId}" value="시럽 추가" data-price="0">
        <label for="syrup-${menuId}">시럽 추가 (+0원)</label>
      </div>
    `;
  }
  
  return html;
}

// 메뉴 카드 DOM 요소 생성 (DOM API 사용)
function createMenuCardElement(menu) {
  const options = parseMenuOptions(menu);
  const displayName = createMenuDisplayName(menu.name, options.hasHot, options.hasIce);
  const initialTemp = determineInitialTemperature(options.hasHot, options.hasIce);
  const imagePath = getMenuImagePath(menu.name, initialTemp, initialTemp);
  const initialPrice = calculateMenuPrice(menu.price, initialTemp);

  // 메인 컨테이너
  const menuItem = document.createElement('div');
  menuItem.className = 'menu-item';
  menuItem.setAttribute('data-menu-id', menu.menu_id);

  // 이미지 컨테이너
  const imageContainer = document.createElement('div');
  imageContainer.className = 'menu-image';
  const img = document.createElement('img');
  img.src = imagePath;
  img.alt = displayName;
  img.onerror = function() {
    this.style.display = 'none';
    this.parentElement.classList.add('no-image');
  };
  imageContainer.appendChild(img);
  menuItem.appendChild(imageContainer);

  // 메뉴명
  const title = document.createElement('h3');
  title.textContent = displayName;
  menuItem.appendChild(title);

  // 가격
  const price = document.createElement('div');
  price.className = 'menu-price';
  price.textContent = `${initialPrice.toLocaleString()}원`;
  menuItem.appendChild(price);

  // 옵션 컨테이너
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'menu-options';
  
  // 온도 옵션 추가
  if (options.hasHot || options.hasIce) {
    const hotChecked = options.hasHot && !options.hasIce;
    const iceChecked = options.hasIce && !options.hasHot || (options.hasHot && options.hasIce);
    
    if (options.hasHot) {
      const hotDiv = document.createElement('div');
      hotDiv.className = 'option-checkbox';
      const hotInput = document.createElement('input');
      hotInput.type = 'radio';
      hotInput.name = `temp-${menu.menu_id}`;
      hotInput.id = `hot-${menu.menu_id}`;
      hotInput.value = 'HOT';
      if (hotChecked) hotInput.checked = true;
      const hotLabel = document.createElement('label');
      hotLabel.setAttribute('for', `hot-${menu.menu_id}`);
      hotLabel.textContent = 'HOT';
      hotDiv.appendChild(hotInput);
      hotDiv.appendChild(hotLabel);
      optionsContainer.appendChild(hotDiv);
    }
    
    if (options.hasIce) {
      const iceDiv = document.createElement('div');
      iceDiv.className = 'option-checkbox';
      const iceInput = document.createElement('input');
      iceInput.type = 'radio';
      iceInput.name = `temp-${menu.menu_id}`;
      iceInput.id = `ice-${menu.menu_id}`;
      iceInput.value = 'ICE';
      if (iceChecked) iceInput.checked = true;
      const iceLabel = document.createElement('label');
      iceLabel.setAttribute('for', `ice-${menu.menu_id}`);
      iceLabel.textContent = 'ICE';
      iceDiv.appendChild(iceInput);
      iceDiv.appendChild(iceLabel);
      optionsContainer.appendChild(iceDiv);
    }
  }

  // 추가 옵션 (샷, 시럽)
  if (options.hasShot) {
    const shotPrice = getConfigValue('PRICING.SHOT_ADDITIONAL_PRICE', 500);
    const shotDiv = document.createElement('div');
    shotDiv.className = 'option-checkbox';
    const shotInput = document.createElement('input');
    shotInput.type = 'checkbox';
    shotInput.id = `shot-${menu.menu_id}`;
    shotInput.value = '샷 추가';
    shotInput.setAttribute('data-price', shotPrice);
    const shotLabel = document.createElement('label');
    shotLabel.setAttribute('for', `shot-${menu.menu_id}`);
    shotLabel.textContent = `샷 추가 (+${shotPrice.toLocaleString()}원)`;
    shotDiv.appendChild(shotInput);
    shotDiv.appendChild(shotLabel);
    optionsContainer.appendChild(shotDiv);
  }

  if (options.hasSyrup) {
    const syrupPrice = getConfigValue('PRICING.SYRUP_ADDITIONAL_PRICE', 0);
    const syrupDiv = document.createElement('div');
    syrupDiv.className = 'option-checkbox';
    const syrupInput = document.createElement('input');
    syrupInput.type = 'checkbox';
    syrupInput.id = `syrup-${menu.menu_id}`;
    syrupInput.value = '시럽 추가';
    syrupInput.setAttribute('data-price', syrupPrice);
    const syrupLabel = document.createElement('label');
    syrupLabel.setAttribute('for', `syrup-${menu.menu_id}`);
    syrupLabel.textContent = `시럽 추가 (+${syrupPrice.toLocaleString()}원)`;
    syrupDiv.appendChild(syrupInput);
    syrupDiv.appendChild(syrupLabel);
    optionsContainer.appendChild(syrupDiv);
  }

  menuItem.appendChild(optionsContainer);

  // 담기 버튼
  const addBtn = document.createElement('button');
  addBtn.className = 'add-to-cart-btn';
  addBtn.setAttribute('data-menu-id', menu.menu_id);
  addBtn.textContent = '담기';
  menuItem.appendChild(addBtn);

  return menuItem;
}

// 메뉴 초기 온도 설정 (이벤트 위임으로 변경되므로 초기 설정만 수행)
function initializeMenuTemperature(menu, menuItem) {
  const tempRadios = menuItem.querySelectorAll(`input[name="temp-${menu.menu_id}"]`);
  const menuImage = menuItem.querySelector('.menu-image img');
  const menuImageContainer = menuItem.querySelector('.menu-image');
  const menuTitle = menuItem.querySelector('h3');
  const menuPrice = menuItem.querySelector('.menu-price');
  
  if (!tempRadios || tempRadios.length === 0 || !menuImage || !menuImageContainer) {
    return;
  }
  
  // 초기 설정만 수행 (이벤트는 위임으로 처리)
  const checkedRadio = Array.from(tempRadios).find(radio => radio.checked);
  if (checkedRadio) {
    const initialTemp = checkedRadio.value;
    updateMenuDisplay(menu, menuImage, menuImageContainer, menuTitle, menuPrice, initialTemp);
  }
}

// 메뉴 표시 업데이트 (이미지, 이름, 가격)
function updateMenuDisplay(menu, menuImage, menuImageContainer, menuTitle, menuPrice, temperature) {
  // 이미지 업데이트
  menuImage.style.display = '';
  menuImageContainer.classList.remove('no-image');
  const newImagePath = getMenuImagePath(menu.name, temperature);
  menuImage.src = '';
  setTimeout(() => {
    menuImage.src = newImagePath;
  }, 0);
  
  // 메뉴명 업데이트
  if (menuTitle) {
    menuTitle.textContent = `${menu.name}(${temperature})`;
  }
  
  // 가격 업데이트
  if (menuPrice) {
    const newPrice = calculateMenuPrice(menu.price, temperature);
    menuPrice.textContent = `${newPrice.toLocaleString()}원`;
  }
}

// 메뉴 데이터 캐시 (이벤트 위임에서 사용)
let menusCache = [];

// 담기 버튼 이벤트 위임 설정 (이벤트 위임 사용, 한 번만 등록)
let addToCartHandlerAttached = false;
function setupAddToCartEventDelegation(menuList) {
  if (addToCartHandlerAttached) return;
  addToCartHandlerAttached = true;
  
  menuList.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      e.stopPropagation();
      const menuId = parseInt(btn.dataset.menuId);
      const menu = menusCache.find(m => m.menu_id === menuId);
      if (menu) {
        addToCart(menu, menuId);
      }
    }
  });
}

// 온도 변경 이벤트 위임 설정 (한 번만 등록)
let temperatureHandlerAttached = false;
function setupTemperatureEventDelegation(menuList) {
  if (temperatureHandlerAttached) return;
  temperatureHandlerAttached = true;
  
  menuList.addEventListener('change', (e) => {
    if (e.target.type === 'radio' && e.target.name.startsWith('temp-')) {
      const menuId = parseInt(e.target.name.replace('temp-', ''));
      const menu = menusCache.find(m => m.menu_id === menuId);
      if (menu && e.target.checked) {
        const menuItem = menuList.querySelector(`[data-menu-id="${menuId}"]`);
        if (menuItem) {
          const menuImage = menuItem.querySelector('.menu-image img');
          const menuImageContainer = menuItem.querySelector('.menu-image');
          const menuTitle = menuItem.querySelector('h3');
          const menuPrice = menuItem.querySelector('.menu-price');
          if (menuImage && menuImageContainer) {
            updateMenuDisplay(menu, menuImage, menuImageContainer, menuTitle, menuPrice, e.target.value);
          }
        }
      }
    }
  });
}

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

  // 메뉴 데이터 캐시 업데이트
  menusCache = menus;

  // 공통 함수로 빈 목록 처리
  if (!initializeListContainer(menuList, menus, '등록된 메뉴가 없습니다.')) {
    return;
  }

  // DOM API를 사용하여 메뉴 카드 생성
  menus.forEach(menu => {
    const menuCard = createMenuCardElement(menu);
    menuList.appendChild(menuCard);
  });

  // 이벤트 위임 설정 (한 번만 설정)
  setupAddToCartEventDelegation(menuList);
  setupTemperatureEventDelegation(menuList);

  // 초기 온도 설정
  menus.forEach(menu => {
    const menuItem = menuList.querySelector(`[data-menu-id="${menu.menu_id}"]`);
    if (menuItem) {
      initializeMenuTemperature(menu, menuItem);
    }
  });
}

  if (menus.length === 0) {
    menuList.innerHTML = '<p>등록된 메뉴가 없습니다.</p>';
    return;
  }


// 선택된 옵션 수집
function collectSelectedOptions(menuId) {
  const temperature = document.querySelector(`input[name="temp-${menuId}"]:checked`);
  const shot = document.getElementById(`shot-${menuId}`);
  const syrup = document.getElementById(`syrup-${menuId}`);

  const options = [];
  let additionalPrice = 0;
  let displayName = '';

  // 온도 옵션
  if (temperature) {
    const tempValue = temperature.value;
    options.push(tempValue);
    displayName = tempValue;
    // ICE면 추가 가격 적용
    if (tempValue === 'ICE') {
      const icePrice = getConfigValue('PRICING.ICE_ADDITIONAL_PRICE', 500);
      additionalPrice += icePrice;
    }
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

  return {
    options: options.sort(), // 옵션을 정렬하여 비교 정확도 향상
    additionalPrice,
    displayName
  };
}

// 장바구니 아이템 생성
function createCartItem(menu, selectedOptions) {
  const displayName = selectedOptions.displayName 
    ? `${menu.name}(${selectedOptions.displayName})` 
    : menu.name;

  return {
    menu_id: menu.menu_id,
    name: menu.name,
    displayName: displayName,
    basePrice: menu.price,
    options: selectedOptions.options,
    additionalPrice: selectedOptions.additionalPrice,
    quantity: 1,
    totalPrice: menu.price + selectedOptions.additionalPrice
  };
}

// 장바구니에 추가
function addToCart(menu, menuId) {
  // 선택된 옵션 수집
  const selectedOptions = collectSelectedOptions(menuId);
  
  // 장바구니 아이템 생성
  const item = createCartItem(menu, selectedOptions);
  
  // 장바구니에 추가
  const result = CartManager.add(item);
  
  // 사용자 피드백
  if (result.existing) {
    showSuccess('장바구니에 추가되었습니다. (수량: ' + result.quantity + '개)');
  } else {
    showSuccess('장바구니에 추가되었습니다.');
  }

  updateCart();
}

// 장바구니 DOM 요소 캐시
let cartDOMCache = {
  cartItems: null,
  totalAmount: null,
  submitOrderBtn: null
};

// 장바구니 DOM 요소 초기화 (캐싱)
function initCartDOMCache() {
  if (!cartDOMCache.cartItems) {
    cartDOMCache.cartItems = document.getElementById('cart-items');
  }
  if (!cartDOMCache.totalAmount) {
    cartDOMCache.totalAmount = document.getElementById('total-amount');
  }
  if (!cartDOMCache.submitOrderBtn) {
    cartDOMCache.submitOrderBtn = document.getElementById('submit-order');
  }
}

// 장바구니 아이템 DOM 요소 생성
function createCartItemElement(item) {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  
  const extraOptions = item.options.filter(opt => opt !== 'HOT' && opt !== 'ICE');
  const optionsText = extraOptions.length > 0 ? ` (${extraOptions.join(', ')})` : '';
  const displayName = item.displayName || item.name;
  const itemTotalPrice = (item.basePrice + item.additionalPrice) * item.quantity;
  
  const nameSpan = document.createElement('span');
  nameSpan.className = 'cart-item-name';
  nameSpan.textContent = `${displayName}${optionsText} X ${item.quantity}`;
  
  const priceSpan = document.createElement('span');
  priceSpan.className = 'cart-item-price';
  priceSpan.textContent = `${itemTotalPrice.toLocaleString()}원`;
  
  cartItem.appendChild(nameSpan);
  cartItem.appendChild(priceSpan);
  
  return cartItem;
}

// 장바구니 업데이트
function updateCart() {
  initCartDOMCache();
  
  const { cartItems, totalAmount, submitOrderBtn } = cartDOMCache;
  
  if (!cartItems || !totalAmount) return;

  const cart = CartManager.getAll();

  // 기존 내용 제거
  cartItems.textContent = '';

  if (CartManager.isEmpty()) {
    const emptyMsg = typeof window.createEmptyMessageElement === 'function'
      ? window.createEmptyMessageElement('장바구니가 비어있습니다.', 'cart-empty')
      : (() => {
          const msg = document.createElement('p');
          msg.className = 'cart-empty';
          msg.textContent = '장바구니가 비어있습니다.';
          return msg;
        })();
    cartItems.appendChild(emptyMsg);
    totalAmount.textContent = '0원';
    if (submitOrderBtn) submitOrderBtn.disabled = true;
    return;
  }

  if (submitOrderBtn) submitOrderBtn.disabled = false;

  // DOM API를 사용하여 장바구니 아이템 생성
  cart.forEach(item => {
    const cartItemElement = createCartItemElement(item);
    cartItems.appendChild(cartItemElement);
  });

  const total = CartManager.getTotal();
  totalAmount.textContent = `${total.toLocaleString()}원`;
}

// 주문하기
async function submitOrder() {
  if (CartManager.isEmpty()) {
    showError('장바구니가 비어있습니다.');
    return;
  }

  // 로그인 확인
  const user = getUser();
  if (!user) {
    showError('주문하려면 로그인이 필요합니다.');
    if (confirm('로그인 페이지로 이동하시겠습니까?')) {
      window.location.href = '/login';
    }
    return;
  }

  try {
    const cart = CartManager.getAll();
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
      user_id: user.user_id, // 인증된 사용자 ID 사용
      items: orderItems
    });

    showSuccess('주문이 완료되었습니다!');
    CartManager.clear();
    updateCart();
  } catch (error) {
    ErrorHandler.handle(error, '주문 처리');
  }
}

// 주문하기 버튼 이벤트 핸들러 설정 (중복 등록 방지)
let submitOrderHandlerAttached = false;
function setupSubmitOrderHandler() {
  if (submitOrderHandlerAttached) return;
  submitOrderHandlerAttached = true;
  
  const submitOrderBtn = document.getElementById('submit-order');
  if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', submitOrder);
  }
}

// 페이지 로드 시 메뉴 로드
if (document.getElementById('menu-list')) {
  loadMenus();
  setupSubmitOrderHandler();
}

