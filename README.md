# OrderBean v1.0

> 간편 커피 주문 웹서비스 - 바쁜 직장인과 단골 고객을 위한 사전 주문 및 원터치 주문 솔루션

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [API 문서](#api-문서)
- [데이터 모델](#데이터-모델)
- [프로젝트 구조](#프로젝트-구조)
- [성공 지표](#성공-지표)
- [리팩토링 할 일 목록](#-리팩토링-할-일-목록)

## 🎯 프로젝트 개요

**OrderBean**은 카페 대기 시간과 반복적인 커스터마이징 주문 문제를 해결하기 위한 간편 커피 주문 웹서비스입니다.

### 핵심 가치

- ⚡ **속도**: 빠른 주문 및 픽업 (주문 생성 시간 10초 이내)
- 🎯 **편의성**: 반복 주문 최소화
- 📈 **운영 효율**: 주문 흐름 단순화

### 배경 및 필요성

- 출퇴근 시간대 카페 대기 시간 증가
- 커피 커스터마이징 주문 증가로 인한 주문 오류
- 단골 고객 관리의 비효율성

## ✨ 주요 기능

### 고객 기능

- ☕ 커피 메뉴 조회
- 📝 주문 생성 (옵션 선택)
- 📋 주문 내역 조회

### 관리자 기능

- 🍽️ 메뉴 관리 (CRUD)
- 🔄 주문 상태 관리

## 🛠️ 기술 스택

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: REST API 기반 서버
- **Database**: 관계형 데이터베이스

## 🚀 시작하기

### 사전 요구사항

- Node.js (버전 14 이상)
- 관계형 데이터베이스 (MySQL/PostgreSQL)

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/OrderBean.git

# 프로젝트 디렉토리로 이동
cd OrderBean

# 의존성 설치
npm install
```

### 환경 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=orderbean
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3000
```

### 실행

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

### 테스트

```bash
# 모든 테스트 실행
npm test

# Watch 모드로 실행
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage
```

## 📚 API 문서

### 고객 API

#### 메뉴 조회
```
GET /menus
```
커피 메뉴와 가격, 옵션을 조회합니다.

**응답 예시:**
```json
{
  "menus": [
    {
      "menu_id": 1,
      "name": "아메리카노",
      "price": 4000,
      "options": ["HOT", "ICE", "SIZE_S", "SIZE_M", "SIZE_L"]
    }
  ]
}
```

#### 주문 생성
```
POST /orders
```
새로운 주문을 생성합니다.

**요청 예시:**
```json
{
  "user_id": 1,
  "items": [
    {
      "menu_id": 1,
      "options": {
        "temperature": "HOT",
        "size": "SIZE_M"
      }
    }
  ]
}
```

**응답 예시:**
```json
{
  "order_id": 1,
  "status": "접수",
  "created_at": "2025-11-01T09:00:00Z"
}
```

#### 주문 내역 조회
```
GET /orders?user_id={user_id}
```
사용자의 주문 내역을 조회합니다.

### 관리자 API

#### 메뉴 등록
```
POST /admin/menus
```

#### 메뉴 수정
```
PUT /admin/menus/{id}
```

#### 메뉴 삭제
```
DELETE /admin/menus/{id}
```

#### 주문 상태 변경
```
PUT /admin/orders/{id}/status
```

**요청 예시:**
```json
{
  "status": "제조중"
}
```

## 🗄️ 데이터 모델

### 엔터티

#### User
- `user_id` (PK)
- `role` (고객/관리자)

#### Menu
- `menu_id` (PK)
- `name`
- `price`

#### Order
- `order_id` (PK)
- `user_id` (FK)
- `status` (접수/제조중/완료)
- `created_at`

#### OrderItem
- `order_item_id` (PK)
- `order_id` (FK)
- `menu_id` (FK)
- `options` (JSON)

### 관계

- User 1:N Order
- Order 1:N OrderItem
- Menu 1:N OrderItem

## 📁 프로젝트 구조

```
OrderBean/
├── frontend/          # 프론트엔드 코드
│   ├── html/
│   ├── css/
│   └── js/
├── backend/           # 백엔드 코드
│   ├── routes/
│   ├── models/
│   └── controllers/
├── database/          # 데이터베이스 스키마
├── docs/              # 문서
└── README.md
```

## 📊 성공 지표

| 지표 | 목표 |
|------|------|
| 평균 주문 시간 | 10초 이내 |
| 주문 처리 성공률 | 99% 이상 |
| 메뉴 조회 응답 시간 | 2초 이내 |
| 주문 생성 응답 시간 | 3초 이내 |

## 🔒 비기능 요구사항

### 성능
- 메뉴 조회: 2초 이내
- 주문 생성: 3초 이내

### 보안
- HTTPS 통신
- 역할 기반 접근 제어 (RBAC)

### 확장성
- REST API 기반 구조

### 사용성
- 3클릭 이내 주문 완료

## 🧪 테스트

프로젝트에는 Jest를 사용한 단위 테스트와 통합 테스트가 포함되어 있습니다.

### 테스트 실행

```bash
# 모든 테스트 실행
npm test

# Watch 모드 (파일 변경 시 자동 재실행)
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage
```

### 테스트 커버리지

현재 테스트 커버리지 상태:

- **전체 커버리지**: 72.52% Statements, 76.69% Branch, 80% Functions
- **Models**: 81.39% (User, OrderItem 테스트 추가 완료)
- **Routes**: 100%
- **Controllers**: 55.84% (개선 중)

자세한 커버리지 리포트는 `coverage/index.html`에서 확인하거나 [docs/COVERAGE.md](docs/COVERAGE.md)를 참고하세요.

### 테스트 구조

- **단위 테스트**: Models, Controllers의 개별 기능 테스트
- **통합 테스트**: API 엔드포인트의 전체 흐름 테스트

자세한 내용은 [tests/README.md](tests/README.md)를 참고하세요.

## 📝 사용자 스토리

### 커피 메뉴 조회
```
Given 고객이 웹서비스에 접속해 있다
When 메뉴 조회 페이지에 접근한다
Then 커피 메뉴와 가격, 옵션이 표시된다
```

### 주문 생성
```
Given 고객이 커피 메뉴를 선택했다
When 옵션을 선택하고 주문한다
Then 주문이 생성되고 상태는 접수이다
```

### 주문 내역 조회
```
Given 고객이 로그인 상태이다
When 주문 내역 페이지에 접근한다
Then 자신의 주문 목록을 확인할 수 있다
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👥 기여자

- 상보 최

## 📅 버전 정보

- **버전**: 1.0
- **작성일**: 2025-11-01
- **상태**: Draft

---

**Note**: 이 프로젝트는 현재 개발 중입니다. 결제 시스템 연동 및 모바일 앱은 Phase 2에서 계획되어 있습니다.


RED단계 완료

GREEN단계 시작

## 🔧 리팩토링 할 일 목록

프런트엔드 코드 리팩토링을 위한 우선순위별 개선 사항입니다. 자세한 분석 내용은 [reports/FRONTEND_REFACTORING_ANALYSIS.md](reports/FRONTEND_REFACTORING_ANALYSIS.md)를 참고하세요.

### 🔴 긴급 (즉시 개선 필요)

- [x] **API 메서드 중복 제거** (`auth.js`)
  - 공통 헤더 생성 함수 도입
  - 예상 시간: 1시간
  - 파일: `frontend/js/auth.js`
  - 완료일: 2025-01-27

- [x] **전역 변수 모듈화**
  - `cart`, `inventoryData`, `menusCache` 등 전역 변수를 모듈 패턴 또는 클래스 기반 상태 관리로 변경
  - 예상 시간: 2시간
  - 파일: `frontend/js/menu.js`, `frontend/js/admin.js`
  - 완료일: 2025-01-27
  - 변경 사항:
    - `CartManager` 모듈 패턴으로 `cart` 전역 변수 캡슐화
    - `InventoryManager` 모듈 패턴으로 `inventoryData` 전역 변수 캡슐화
    - `MenuCacheManager` 모듈 패턴으로 `menusCache` 전역 변수 캡슐화

- [x] **함수 분리** (`displayMenus`, `addToCart`)
  - 단일 책임 원칙(SRP) 적용
  - `displayMenus()` 함수 분리 (235줄 → 작은 함수들로)
  - `addToCart()` 함수 복잡도 감소
  - 예상 시간: 3시간
  - 파일: `frontend/js/menu.js`
  - 완료일: 2025-01-27
  - 변경 사항:
    - `displayMenus()` 함수를 9개의 작은 함수로 분리:
      - `parseMenuOptions()`: 메뉴 옵션 파싱
      - `createMenuDisplayName()`: 메뉴 표시명 생성
      - `determineInitialTemperature()`: 초기 온도 결정
      - `calculateMenuPrice()`: 메뉴 가격 계산
      - `createTemperatureOptionsHTML()`: 온도 옵션 HTML 생성
      - `createExtraOptionsHTML()`: 추가 옵션 HTML 생성
      - `createMenuCardHTML()`: 메뉴 카드 HTML 생성
      - `setupTemperatureChangeHandler()`: 온도 변경 핸들러 설정
      - `updateMenuDisplay()`: 메뉴 표시 업데이트
      - `attachAddToCartListeners()`: 담기 버튼 이벤트 리스너 연결
    - `addToCart()` 함수를 3개의 작은 함수로 분리:
      - `collectSelectedOptions()`: 선택된 옵션 수집
      - `createCartItem()`: 장바구니 아이템 생성
      - `addToCart()`: 메인 로직 (간소화)

### 🟡 중요 (단기 개선)

- [x] **에러 처리 통일**
  - 에러 핸들러 유틸리티 생성
  - `showError()`와 `console.error()` 혼용 문제 해결
  - 예상 시간: 1시간
  - 파일: `frontend/js/app.js`, 전체 파일
  - 완료일: 2025-01-27
  - 변경 사항:
    - `ErrorHandler` 유틸리티 객체 생성:
      - `handle(error, context)`: 사용자 알림 + 콘솔 로깅
      - `log(error, context)`: 콘솔 로깅만 (사용자 알림 없음)
    - `SuccessHandler` 유틸리티 객체 생성:
      - `show(message)`: 성공 메시지 표시
    - 모든 `console.error()` 호출을 `ErrorHandler`로 통일
    - 하위 호환성을 위해 기존 `showError()`, `showSuccess()` 함수 유지
    - 에러 발생 컨텍스트 정보 추가로 디버깅 용이성 향상

- [x] **하드코딩 값 상수화**
  - ICE 추가 가격 500원, API_BASE_URL, 재고 임계값 등 상수 파일로 분리
  - 예상 시간: 1시간
  - 파일: `frontend/js/config.js` (신규 생성), `frontend/js/menu.js`, `frontend/js/app.js`
  - 완료일: 2025-01-27
  - 변경 사항:
    - `config.js` 파일 생성: 모든 설정 상수를 중앙 관리
      - `Config.API.BASE_URL`: API 기본 URL
      - `Config.PRICING`: 가격 관련 상수 (ICE 추가 가격, 샷 추가 가격, 시럽 추가 가격)
      - `Config.INVENTORY`: 재고 관련 상수 (기본 재고, 재고 부족 임계값)
      - `Config.DASHBOARD`: 대시보드 설정 (새로고침 간격)
      - `Config.DEFAULTS`: 기본값 설정
    - 모든 하드코딩된 값들을 Config 상수로 변경:
      - `app.js`, `auth.js`: API_BASE_URL
      - `menu.js`: ICE 추가 가격, 샷 추가 가격
      - `admin.js`: 기본 재고, 재고 임계값, 폴링 간격
    - `getConfigValue()` 헬퍼 함수 추가로 안전한 설정 값 접근
    - 모든 HTML 파일에 `config.js` 로드 추가

- [x] **DOM 조작 최적화**
  - 이벤트 위임 적용
  - 반복적인 DOM 쿼리 최소화
  - `innerHTML` 대신 DOM API 사용 고려
  - 예상 시간: 2시간
  - 파일: `frontend/js/menu.js`, `frontend/js/admin.js`
  - 완료일: 2025-01-27
  - 변경 사항:
    - **이벤트 위임 적용**:
      - `menu.js`: 담기 버튼, 온도 변경 이벤트를 부모 요소에 위임
      - `admin.js`: 재고 버튼, 메뉴 삭제 버튼, 주문 상태 업데이트 버튼 이벤트 위임
      - 각 이벤트 핸들러는 한 번만 등록되도록 플래그 사용
    - **DOM 요소 캐싱**:
      - `menu.js`: 장바구니 DOM 요소 캐싱 (`cartDOMCache`)
      - `admin.js`: 대시보드 통계 DOM 요소 캐싱 (`adminDOMCache`)
      - 반복적인 `getElementById` 호출 제거
    - **innerHTML 대신 DOM API 사용**:
      - `menu.js`: `createMenuCardElement()` - DOM API로 메뉴 카드 생성
      - `menu.js`: `createCartItemElement()` - DOM API로 장바구니 아이템 생성
      - `admin.js`: `createInventoryCardElement()` - DOM API로 재고 카드 생성
      - `admin.js`: `createAdminMenuCardElement()` - DOM API로 관리자 메뉴 카드 생성
      - `admin.js`: `createOrderCardElement()`, `createOrderItemElement()` - DOM API로 주문 카드 생성
    - **인라인 이벤트 핸들러 제거**: 모든 `onclick` 속성을 `data-*` 속성과 이벤트 위임으로 대체
    - **메뉴 데이터 캐싱**: 이벤트 위임에서 사용할 메뉴 데이터를 `menusCache`에 저장

- [x] **이벤트 리스너 관리 개선**
  - 인라인 이벤트 핸들러 제거 (`onclick` 속성)
  - 이벤트 리스너 중복 등록 방지
  - 예상 시간: 1시간
  - 파일: `frontend/js/admin.js`, `frontend/html/admin.html`
  - 완료일: 2025-01-27
  - 변경 사항:
    - **인라인 이벤트 핸들러 제거**: HTML 파일에 `onclick` 속성 없음 확인 (이미 제거됨)
    - **이벤트 위임 적용**:
      - `initStatCards()`: 통계 카드 클릭 이벤트를 `dashboard-stats`에 위임
      - `initTabs()`: 탭 버튼 클릭 이벤트를 `admin-tabs`에 위임
    - **중복 등록 방지 강화**:
      - 모든 이벤트 핸들러에 플래그 추가 (`*HandlerAttached`)
      - `setupMenuFormHandler()`: 메뉴 등록 폼 이벤트 중복 등록 방지
      - `setupSubmitOrderHandler()`: 주문하기 버튼 이벤트 중복 등록 방지
      - `initStatCards()`, `initTabs()`: 이벤트 위임으로 변경하여 중복 등록 방지
    - **이벤트 핸들러 중앙 관리**: 모든 이벤트 핸들러를 setup 함수로 통일

- [x] **중복 코드 제거**
  - 메뉴 표시 로직 중복 제거 (`menu.js` vs `admin.js`)
  - 불필요한 조건문 중복 제거 (`updateCart()` 함수)
  - 예상 시간: 2시간
  - 파일: `frontend/js/menu.js`, `frontend/js/admin.js`
  - 완료일: 2025-01-27
  - 변경 사항:
    - **공통 유틸리티 파일 생성** (`utils.js`):
      - `formatMenuNameWithTemperature()`: 메뉴명에 온도 표시 추가 (중복 제거)
      - `parseMenuOptions()`: 메뉴 옵션 파싱 (중복 제거)
      - `createEmptyMessageElement()`: 빈 메시지 DOM 요소 생성 (중복 제거)
      - `initializeListContainer()`: 목록 컨테이너 초기화 및 빈 상태 처리 (중복 제거)
    - **메뉴 표시 로직 중복 제거**:
      - `menu.js`: `createMenuDisplayName()` → `formatMenuNameWithTemperature()` 사용
      - `admin.js`: 재고 카드 생성 시 중복된 메뉴명 로직 → `formatMenuNameWithTemperature()` 사용
    - **빈 목록 처리 로직 중복 제거**:
      - `displayMenus()`, `displayMenusAdmin()`, `displayInventory()`, `displayOrdersAdmin()` 모두 `initializeListContainer()` 사용
      - "등록된 메뉴가 없습니다.", "주문이 없습니다." 등 빈 메시지 생성 로직 통일
    - **모든 HTML 파일에 `utils.js` 추가**: `index.html`, `admin.html`

- [x] **주석 처리된 코드 정리**
  - 사용하지 않는 주석 처리된 코드 제거
  - 예상 시간: 30분
  - 파일: `frontend/js/admin.js`
  - 완료일: 2025-01-27
  - 변경 사항:
    - **주석 처리된 API 호출 코드 제거**:
      - `updateInventory()` 함수에서 주석 처리된 `await api.put()` 호출 제거
      - 관련 설명 주석도 함께 제거
    - **코드 정리**: 불필요한 주석 처리된 코드 제거로 코드 가독성 향상

### 🟢 선택적 (중장기 개선)

- [ ] **TypeScript 도입**
  - 점진적 마이그레이션
  - JSDoc 타입 주석 추가 (중간 단계)
  - 예상 시간: 1주
  - 파일: 전체 프런트엔드 코드

- [ ] **모듈 시스템 도입**
  - ES6 Modules 또는 번들러(Webpack/Vite) 도입
  - 파일 간 의존성 명확화
  - 예상 시간: 2일
  - 파일: 전체 프런트엔드 코드

- [ ] **테스트 코드 작성**
  - 프런트엔드 단위 테스트 및 통합 테스트 작성
  - 예상 시간: 1주
  - 파일: `tests/frontend/` (신규 생성)

- [ ] **CSS 네이밍 일관성 개선**
  - BEM 방법론 적용 검토
  - 예상 시간: 1일
  - 파일: `frontend/css/style.css`

- [ ] **접근성(A11y) 개선**
  - ARIA 속성 추가
  - 키보드 네비게이션 고려
  - 예상 시간: 2일
  - 파일: 전체 HTML 파일

- [ ] **성능 최적화**
  - 이미지 지연 로딩 적용
  - 디바운싱/스로틀링 적용 (폴링 등)
  - 예상 시간: 1일
  - 파일: `frontend/js/admin.js`, `frontend/js/menu.js`

### 📊 진행 상황

- **총 작업 항목**: 15개
- **완료**: 9개
- **진행 중**: 0개
- **대기 중**: 6개

### 📝 참고 사항

- 각 작업은 독립적으로 진행 가능하지만, 우선순위 순서대로 진행하는 것을 권장합니다.
- 긴급 항목(3개)은 코드 품질에 직접적인 영향을 미치므로 최우선으로 처리하세요.
- 작업 완료 후 체크박스를 업데이트하고, 변경 사항을 커밋하세요.

