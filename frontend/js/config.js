// 애플리케이션 설정 상수

const Config = {
  // API 설정
  API: {
    BASE_URL: 'http://localhost:3000/api'
  },

  // 가격 설정
  PRICING: {
    ICE_ADDITIONAL_PRICE: 500,      // ICE 옵션 추가 가격 (원)
    SHOT_ADDITIONAL_PRICE: 500,      // 샷 추가 옵션 가격 (원)
    SYRUP_ADDITIONAL_PRICE: 0        // 시럽 추가 옵션 가격 (원)
  },

  // 재고 설정
  INVENTORY: {
    DEFAULT_STOCK: 10,               // 기본 재고 수량
    LOW_STOCK_THRESHOLD: 5            // 재고 부족 임계값
  },

  // 대시보드 설정
  DASHBOARD: {
    REFRESH_INTERVAL: 5000            // 데이터 새로고침 간격 (밀리초)
  },

  // 기본값 설정
  DEFAULTS: {
    TEMPERATURE: 'ICE'                // 기본 온도 옵션
  }
};

// 전역 변수로도 사용 가능하도록 설정 (하위 호환성)
if (typeof window !== 'undefined') {
  window.Config = Config;
}

