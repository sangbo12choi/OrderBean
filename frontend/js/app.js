// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// auth.js가 로드되기 전에 API_BASE_URL이 정의되어야 함
// auth.js에서 이 변수를 사용함

// Utility Functions
const api = {
  async get(url) {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  async post(url, data) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  async put(url, data) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  async delete(url) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
};

// 통일된 에러 핸들러 유틸리티
const ErrorHandler = {
  /**
   * 에러 처리 (사용자 알림 + 콘솔 로깅)
   * @param {string|Error} error - 에러 메시지 또는 Error 객체
   * @param {string} [context] - 에러 발생 컨텍스트 (선택사항)
   */
  handle(error, context) {
    const message = error instanceof Error ? error.message : error;
    const errorMessage = context ? `[${context}] ${message}` : message;
    
    // 사용자에게 알림
    alert(`오류: ${message}`);
    
    // 콘솔에 상세 로깅
    if (error instanceof Error) {
      console.error(errorMessage, error);
    } else {
      console.error(errorMessage);
    }
  },

  /**
   * 에러만 로깅 (사용자 알림 없음)
   * @param {string|Error} error - 에러 메시지 또는 Error 객체
   * @param {string} [context] - 에러 발생 컨텍스트 (선택사항)
   */
  log(error, context) {
    const message = error instanceof Error ? error.message : error;
    const errorMessage = context ? `[${context}] ${message}` : message;
    
    if (error instanceof Error) {
      console.error(errorMessage, error);
    } else {
      console.error(errorMessage);
    }
  }
};

// Success Handler
const SuccessHandler = {
  /**
   * 성공 메시지 표시
   * @param {string} message - 성공 메시지
   */
  show(message) {
    alert(`성공: ${message}`);
  }
};

// 하위 호환성을 위한 기존 함수 유지 (deprecated)
function showError(message) {
  ErrorHandler.handle(message);
}

function showSuccess(message) {
  SuccessHandler.show(message);
}

