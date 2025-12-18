// 인증 관련 유틸리티 함수

// 토큰 가져오기
function getToken() {
  return localStorage.getItem('token');
}

// 사용자 정보 가져오기
function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// 로그인 상태 확인
function isLoggedIn() {
  return !!getToken();
}

// 로그아웃
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// API 요청에 토큰 추가 (app.js의 api 객체 확장)
if (typeof api !== 'undefined') {
  // 공통 헤더 생성 함수
  function createAuthHeaders(includeContentType = false) {
    const headers = {};
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // 공통 에러 처리 함수
  async function handleApiError(response) {
    if (response.status === 401) {
      logout();
      throw new Error('로그인이 필요합니다.');
    }
    
    // 에러 응답 파싱 시도
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: `HTTP ${response.status} 오류가 발생했습니다.` };
    }
    
    // 에러 객체에 원본 데이터도 포함
    const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    error.error = errorData.error;
    error.message = errorData.message || errorData.error;
    throw error;
  }

  // API Base URL 헬퍼 함수
  function getApiBaseUrl() {
    return typeof Config !== 'undefined' ? Config.API.BASE_URL : 'http://localhost:3000/api';
  }

  // API 메서드 재정의 (인증 토큰 포함)
  api.get = async function(url) {
    const headers = createAuthHeaders();
    const response = await fetch(`${getApiBaseUrl()}${url}`, { headers });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    return await response.json();
  };

  api.post = async function(url, data) {
    const headers = createAuthHeaders(true);
    const response = await fetch(`${getApiBaseUrl()}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    return await response.json();
  };

  api.put = async function(url, data) {
    const headers = createAuthHeaders(true);
    const response = await fetch(`${getApiBaseUrl()}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    return await response.json();
  };

  api.delete = async function(url) {
    const headers = createAuthHeaders();
    const response = await fetch(`${getApiBaseUrl()}${url}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    return await response.json();
  };
}

