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
  // 기존 api 객체에 토큰을 포함하는 메서드 추가
  const originalGet = api.get;
  const originalPost = api.post;
  const originalPut = api.put;
  const originalDelete = api.delete;

  api.get = async function(url) {
    const token = getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // 인증 실패 시 로그아웃 처리
        logout();
        throw new Error('로그인이 필요합니다.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };

  api.post = async function(url, data) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
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
    return await response.json();
  };

  api.put = async function(url, data) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('로그인이 필요합니다.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };

  api.delete = async function(url) {
    const token = getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('로그인이 필요합니다.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };
}

