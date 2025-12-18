# 프런트엔드 코드 리팩토링 분석 보고서

## 📋 개요
프런트엔드 코드를 분석하여 발견된 코드 스멜과 개선점을 정리한 문서입니다.

---

## 🔴 주요 코드 스멜 (Code Smells)

### 1. **중복 코드 (DRY 위반)**

#### 1.1 API 메서드 재정의 중복 (`auth.js`)
```javascript
// 문제: api.get, api.post, api.put, api.delete 모두 유사한 패턴으로 재정의
// 각 메서드마다 토큰 추가 로직이 반복됨
api.get = async function(url) { /* 토큰 추가 로직 */ }
api.post = async function(url, data) { /* 토큰 추가 로직 */ }
api.put = async function(url, data) { /* 토큰 추가 로직 */ }
api.delete = async function(url) { /* 토큰 추가 로직 */ }
```
**개선 방안**: 공통 헤더 생성 함수를 만들어 재사용

#### 1.2 메뉴 표시 로직 중복
- `menu.js`의 `displayMenus()`와 `admin.js`의 `displayMenusAdmin()`에서 유사한 로직 반복
- 메뉴명에 온도 표시하는 로직이 여러 곳에 중복

#### 1.3 에러 처리 중복
- 각 API 호출마다 동일한 try-catch 패턴 반복
- 에러 메시지가 하드코딩되어 있음

---

### 2. **전역 변수 남용**

```javascript
// menu.js
let cart = []; // 전역 변수

// admin.js
let inventoryData = {}; // 전역 변수
let menusCache = {}; // 전역 변수
```
**문제점**:
- 네임스페이스 오염
- 테스트 어려움
- 상태 관리 복잡도 증가

**개선 방안**: 모듈 패턴 또는 클래스 기반 상태 관리 도입

---

### 3. **함수 책임 분리 부족 (SRP 위반)**

#### 3.1 `displayMenus()` 함수가 너무 큼 (235줄)
```javascript
function displayMenus(menus) {
  // 1. 메뉴 HTML 생성
  // 2. 이벤트 리스너 등록
  // 3. 온도 변경 핸들러 설정
  // 4. 이미지 업데이트 로직
  // 5. 가격 계산 로직
}
```
**개선 방안**: 함수를 작은 단위로 분리
- `createMenuHTML()`
- `attachMenuEventListeners()`
- `updateMenuImage()`
- `calculateMenuPrice()`

#### 3.2 `addToCart()` 함수 복잡도 높음
- 옵션 파싱, 가격 계산, 중복 체크, UI 업데이트를 모두 처리

---

### 4. **하드코딩된 값들**

```javascript
// menu.js
if (tempValue === 'ICE') {
  additionalPrice += 500; // 하드코딩
}

// app.js
const API_BASE_URL = 'http://localhost:3000/api'; // 하드코딩
```
**개선 방안**: 설정 파일 또는 상수 객체로 분리

---

### 5. **에러 처리 일관성 부족**

```javascript
// 일부는 showError 사용
catch (error) {
  showError('메뉴를 불러오는 중 오류가 발생했습니다.');
}

// 일부는 console.error만 사용
catch (error) {
  console.error('Error loading dashboard stats:', error);
}
```
**개선 방안**: 통일된 에러 처리 유틸리티 사용

---

### 6. **DOM 조작 최적화 부족**

#### 6.1 반복적인 DOM 쿼리
```javascript
// 여러 곳에서 동일한 요소를 반복 조회
const menuList = document.getElementById('menu-list');
const cartItems = document.getElementById('cart-items');
const totalAmount = document.getElementById('total-amount');
```

#### 6.2 innerHTML 직접 조작
```javascript
menuList.innerHTML = menus.map(menu => { /* ... */ }).join('');
```
**문제점**: XSS 취약점 가능성, 성능 이슈

**개선 방안**: 템플릿 리터럴 대신 DOM API 사용 또는 템플릿 엔진 도입

---

### 7. **이벤트 리스너 관리 문제**

#### 7.1 인라인 이벤트 핸들러 (`admin.js`)
```html
<button onclick="updateInventory(${menu.menu_id}, -1)">-</button>
```
**문제점**: 
- 전역 네임스페이스 오염
- 이벤트 위임 불가
- 테스트 어려움

#### 7.2 이벤트 리스너 중복 등록 가능성
- `displayMenus()` 호출 시마다 새로운 이벤트 리스너가 등록됨

---

### 8. **타입 안정성 부족**

- JavaScript만 사용하여 런타임 에러 가능성
- 매개변수 검증 부족
- API 응답 구조 가정에 의존

**개선 방안**: TypeScript 도입 또는 JSDoc 타입 주석 추가

---

### 9. **비동기 처리 일관성 부족**

```javascript
// 일부는 async/await
async function loadMenus() {
  const data = await api.get('/menus');
}

// 일부는 Promise 체이닝 (없음)
// 일부는 콜백 (없음)
```

---

### 10. **코드 구조화 부족**

- 파일 간 의존성 명확하지 않음
- 모듈 시스템 미사용 (ES6 modules)
- 공통 유틸리티 함수 분리 부족

---

## 🟡 중간 우선순위 개선 사항

### 11. **매직 넘버/문자열**

```javascript
// menu.js
if (stock < 5) { // 매직 넘버
  // ...
}

// admin.js
setInterval(() => { /* ... */ }, 5000); // 매직 넘버
```

### 12. **긴 함수 체이닝**

```javascript
// menu.js:327-334
cartItems.innerHTML = cart.map((item, index) => {
  const extraOptions = item.options.filter(opt => opt !== 'HOT' && opt !== 'ICE');
  const optionsText = extraOptions.length > 0 ? ` (${extraOptions.join(', ')})` : '';
  const displayName = item.displayName || item.name;
  const itemTotalPrice = (item.basePrice + item.additionalPrice) * item.quantity;
  // ...
}).join('');
```

### 13. **불필요한 조건문 중복**

```javascript
// menu.js:318-333
if (cart.length === 0) {
  // ...
  return;
}
// ...
if (cart.length === 0) { // 중복 체크
  // ...
  return;
}
```

### 14. **주석 처리된 코드**

```javascript
// admin.js:184-185
// 실제로는 서버 API 호출 필요
// await api.put(`/admin/inventory/${menuId}`, { stock: newStock });
```

---

## 🟢 낮은 우선순위 개선 사항

### 15. **CSS 클래스 네이밍 일관성**

- BEM 방법론 미사용
- 일부는 케밥 케이스, 일부는 다른 스타일

### 16. **접근성 (A11y) 고려 부족**

- ARIA 속성 부족
- 키보드 네비게이션 고려 부족

### 17. **성능 최적화**

- 이미지 지연 로딩 없음
- 디바운싱/스로틀링 미적용 (폴링 등)

---

## 📊 코드 메트릭

### 파일별 복잡도
- `menu.js`: 420줄 (매우 큼)
- `admin.js`: 477줄 (매우 큼)
- `auth.js`: 140줄
- `order.js`: 109줄
- `app.js`: 67줄

### 순환 복잡도가 높은 함수
1. `displayMenus()` - 약 15+
2. `addToCart()` - 약 10+
3. `displayOrdersAdmin()` - 약 12+

---

## 🎯 우선순위별 개선 계획

### 🔴 긴급 (즉시 개선 필요)

1. **API 메서드 중복 제거** (`auth.js`)
   - 공통 헤더 생성 함수 도입
   - 예상 시간: 1시간

2. **전역 변수 모듈화**
   - 모듈 패턴 또는 클래스 기반 상태 관리
   - 예상 시간: 2시간

3. **함수 분리** (`displayMenus`, `addToCart`)
   - 단일 책임 원칙 적용
   - 예상 시간: 3시간

### 🟡 중요 (단기 개선)

4. **에러 처리 통일**
   - 에러 핸들러 유틸리티 생성
   - 예상 시간: 1시간

5. **하드코딩 값 상수화**
   - 설정 파일 생성
   - 예상 시간: 1시간

6. **DOM 조작 최적화**
   - 이벤트 위임 적용
   - 예상 시간: 2시간

### 🟢 선택적 (중장기 개선)

7. **TypeScript 도입**
   - 점진적 마이그레이션
   - 예상 시간: 1주

8. **모듈 시스템 도입**
   - ES6 Modules 또는 번들러 도입
   - 예상 시간: 2일

9. **테스트 코드 작성**
   - 단위 테스트 및 통합 테스트
   - 예상 시간: 1주

---

## 📝 개선 예시 코드

### 예시 1: API 헤더 생성 함수로 중복 제거

**Before:**
```javascript
api.get = async function(url) {
  const token = getToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // ...
};

api.post = async function(url, data) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // ...
};
```

**After:**
```javascript
function createAuthHeaders(contentType = false) {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

api.get = async function(url) {
  const headers = createAuthHeaders();
  // ...
};

api.post = async function(url, data) {
  const headers = createAuthHeaders(true);
  // ...
};
```

### 예시 2: 모듈 패턴으로 전역 변수 제거

**Before:**
```javascript
let cart = [];
```

**After:**
```javascript
const CartManager = (function() {
  let cart = [];
  
  return {
    add(item) { /* ... */ },
    remove(index) { /* ... */ },
    clear() { /* ... */ },
    getAll() { return [...cart]; }
  };
})();
```

### 예시 3: 함수 분리

**Before:**
```javascript
function displayMenus(menus) {
  // 200+ 줄의 복잡한 로직
}
```

**After:**
```javascript
function createMenuCard(menu) { /* ... */ }
function attachMenuEvents(menu, element) { /* ... */ }
function updateMenuImage(menuId, temperature) { /* ... */ }
function calculateMenuPrice(menu, temperature) { /* ... */ }

function displayMenus(menus) {
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = menus.map(menu => createMenuCard(menu)).join('');
  menus.forEach(menu => {
    const element = menuList.querySelector(`[data-menu-id="${menu.menu_id}"]`);
    attachMenuEvents(menu, element);
  });
}
```

---

## ✅ 체크리스트

- [ ] API 메서드 중복 제거
- [ ] 전역 변수 모듈화
- [ ] 큰 함수 분리 (SRP 적용)
- [ ] 에러 처리 통일
- [ ] 하드코딩 값 상수화
- [ ] DOM 조작 최적화
- [ ] 이벤트 리스너 관리 개선
- [ ] 인라인 이벤트 핸들러 제거
- [ ] 중복 코드 제거
- [ ] 주석 처리된 코드 정리
- [ ] 타입 안정성 개선 (JSDoc 또는 TypeScript)
- [ ] 모듈 시스템 도입
- [ ] 테스트 코드 작성

---

## 📚 참고 자료

- Clean Code (Robert C. Martin)
- Refactoring (Martin Fowler)
- JavaScript: The Good Parts (Douglas Crockford)
- MDN Web Docs - JavaScript Best Practices

---

**작성일**: 2025-01-27  
**분석 대상**: 프런트엔드 JavaScript 코드 전체

