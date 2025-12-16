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

