// 메뉴 관련 기능

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

    // 초기 이미지 경로 결정 (라디오 버튼의 checked 속성과 정확히 동일한 로직 사용)
    // 라디오 버튼 로직: 
    // - HOT: hasHot && !hasIce ? 'checked' : hasHot && hasIce ? '' : ''
    // - ICE: hasIce && !hasHot ? 'checked' : hasHot && hasIce ? 'checked' : ''
    let initialTemp;
    if (hasHot && !hasIce) {
      initialTemp = 'HOT';  // HOT만 있으면 HOT이 checked
    } else if (hasIce && !hasHot) {
      initialTemp = 'ICE';  // ICE만 있으면 ICE가 checked
    } else if (hasHot && hasIce) {
      initialTemp = 'ICE';  // 둘 다 있으면 ICE가 checked (기본값)
    } else {
      initialTemp = 'ICE';  // 기본값
    }
    const imagePath = getMenuImagePath(menu.name, initialTemp, initialTemp);
    
    // 초기 가격 계산 (ICE면 +500원)
    const initialPrice = initialTemp === 'ICE' ? menu.price + 500 : menu.price;
    
    return `
      <div class="menu-item" data-menu-id="${menu.menu_id}">
        <div class="menu-image">
          <img src="${imagePath}" alt="${menuDisplayName}" onerror="this.style.display='none'; this.parentElement.classList.add('no-image');">
        </div>
        <h3>${menuDisplayName}</h3>
        <div class="menu-price">${initialPrice.toLocaleString()}원</div>
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

  // 온도 선택에 따라 이미지 업데이트 (모든 메뉴에 적용)
  menus.forEach(menu => {
    const tempRadios = menuList.querySelectorAll(`input[name="temp-${menu.menu_id}"]`);
    const menuItem = menuList.querySelector(`[data-menu-id="${menu.menu_id}"]`);
    const menuImage = menuItem ? menuItem.querySelector('.menu-image img') : null;
    const menuImageContainer = menuItem ? menuItem.querySelector('.menu-image') : null;
    
    if (tempRadios && tempRadios.length > 0 && menuImage && menuImageContainer) {
      // 메뉴명 및 가격 요소 찾기
      const menuTitle = menuItem ? menuItem.querySelector('h3') : null;
      const menuPrice = menuItem ? menuItem.querySelector('.menu-price') : null;
      
      // 초기 선택된 라디오 버튼에 맞춰 이미지, 메뉴명, 가격 설정
      const checkedRadio = Array.from(tempRadios).find(radio => radio.checked);
      if (checkedRadio) {
        const initialTemp = checkedRadio.value;
        const initialImagePath = getMenuImagePath(menu.name, initialTemp);
        menuImage.src = initialImagePath;
        // 이미지 표시 상태 확실히 설정
        menuImage.style.display = '';
        menuImageContainer.classList.remove('no-image');
        
        // 초기 메뉴명 설정
        if (menuTitle) {
          menuTitle.textContent = `${menu.name}(${initialTemp})`;
        }
        
        // 초기 가격 설정 (ICE면 +500원)
        if (menuPrice) {
          const initialPrice = initialTemp === 'ICE' ? menu.price + 500 : menu.price;
          menuPrice.textContent = `${initialPrice.toLocaleString()}원`;
        }
      }
      
      // 온도 변경 시 이미지, 메뉴명, 가격 업데이트
      tempRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.checked) {
            const selectedTemp = e.target.value;
            // 이미지 표시 상태 복원
            menuImage.style.display = '';
            menuImageContainer.classList.remove('no-image');
            
            // 이미지 경로 업데이트 (강제로 다시 로드)
            const newImagePath = getMenuImagePath(menu.name, selectedTemp);
            // 이미지를 강제로 다시 로드하기 위해 src를 먼저 비우고 다시 설정
            menuImage.src = '';
            // 다음 프레임에서 새 이미지 로드
            setTimeout(() => {
              menuImage.src = newImagePath;
            }, 0);
            
            // 메뉴명 업데이트
            if (menuTitle) {
              menuTitle.textContent = `${menu.name}(${selectedTemp})`;
            }
            
            // 가격 업데이트 (ICE면 +500원)
            if (menuPrice) {
              const newPrice = selectedTemp === 'ICE' ? menu.price + 500 : menu.price;
              menuPrice.textContent = `${newPrice.toLocaleString()}원`;
            }
          }
        });
      });
    }
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
    // ICE면 추가 가격 500원
    if (tempValue === 'ICE') {
      additionalPrice += 500;
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

  // 장바구니에 추가
  const result = CartManager.add(item);
  
  if (result.existing) {
    showSuccess('장바구니에 추가되었습니다. (수량: ' + result.quantity + '개)');
  } else {
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

  const cart = CartManager.getAll();

  if (CartManager.isEmpty()) {
    cartItems.innerHTML = '<p class="cart-empty">장바구니가 비어있습니다.</p>';
    totalAmount.textContent = '0원';
    if (submitOrderBtn) submitOrderBtn.disabled = true;
    return;
  }

  if (submitOrderBtn) submitOrderBtn.disabled = false;

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
    showError(error.message || '주문 처리 중 오류가 발생했습니다.');
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

