// 공통 유틸리티 함수

/**
 * 메뉴명에 온도 표시 추가 (공통 함수)
 * @param {string} menuName - 메뉴 이름
 * @param {Array} options - 메뉴 옵션 배열
 * @returns {string} 온도가 포함된 메뉴 표시명
 */
function formatMenuNameWithTemperature(menuName, options = []) {
  const hasHot = options.includes('HOT');
  const hasIce = options.includes('ICE');
  
  if (hasHot && hasIce) {
    return `${menuName}(ICE)`; // 기본값 ICE
  } else if (hasHot) {
    return `${menuName}(HOT)`;
  } else if (hasIce) {
    return `${menuName}(ICE)`;
  }
  return menuName;
}

/**
 * 메뉴 옵션 파싱 (공통 함수)
 * @param {Object} menu - 메뉴 객체
 * @returns {Object} 파싱된 옵션 정보
 */
function parseMenuOptions(menu) {
  const options = menu.options || [];
  return {
    hasHot: options.includes('HOT'),
    hasIce: options.includes('ICE'),
    hasShot: true, // 항상 표시
    hasSyrup: true // 항상 표시
  };
}

/**
 * 빈 목록 메시지 DOM 요소 생성 (공통 함수)
 * @param {string} message - 표시할 메시지
 * @param {string} [className] - 추가할 CSS 클래스명
 * @returns {HTMLElement} 빈 메시지 요소
 */
function createEmptyMessageElement(message, className = '') {
  const emptyMsg = document.createElement('p');
  if (className) {
    emptyMsg.className = className;
  }
  emptyMsg.textContent = message;
  return emptyMsg;
}

/**
 * 목록 컨테이너 초기화 및 빈 상태 처리 (공통 함수)
 * @param {HTMLElement} container - 목록 컨테이너 요소
 * @param {Array} items - 표시할 아이템 배열
 * @param {string} emptyMessage - 빈 상태 메시지
 * @returns {boolean} 아이템이 있는지 여부
 */
function initializeListContainer(container, items, emptyMessage) {
  if (!container) return false;
  
  // 기존 내용 제거
  container.textContent = '';
  
  if (!items || items.length === 0) {
    const emptyMsg = createEmptyMessageElement(emptyMessage);
    container.appendChild(emptyMsg);
    return false;
  }
  
  return true;
}

// 전역으로 export (다른 파일에서 사용)
if (typeof window !== 'undefined') {
  window.formatMenuNameWithTemperature = formatMenuNameWithTemperature;
  window.parseMenuOptions = parseMenuOptions;
  window.createEmptyMessageElement = createEmptyMessageElement;
  window.initializeListContainer = initializeListContainer;
}

