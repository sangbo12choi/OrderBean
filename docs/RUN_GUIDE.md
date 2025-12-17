# OrderBean 실행 가이드

## 📋 목차
- [애플리케이션 실행](#애플리케이션-실행)
- [테스트 실행](#테스트-실행)
- [빠른 참조](#빠른-참조)

---

## 🚀 애플리케이션 실행

### 1. 개발 모드 실행 (권장)

파일 변경 시 자동으로 서버가 재시작됩니다.

```bash
npm run dev
```

**실행 결과:**
- 서버가 `http://localhost:3000`에서 실행됩니다
- 프론트엔드: `http://localhost:3000/`
- API Health Check: `http://localhost:3000/api/health`

### 2. 프로덕션 모드 실행

```bash
npm start
```

### 3. 환경 변수 설정 (선택사항)

데이터베이스를 사용하지 않는 경우 (더미 모드):
- `.env` 파일에 `USE_DUMMY_DATA=true` 추가
- 또는 `.env` 파일 없이 실행하면 자동으로 더미 모드로 동작

데이터베이스를 사용하는 경우:
- `.env` 파일 생성 및 설정:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=orderbean
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3000
```

---

## 🧪 테스트 실행

### 1. 모든 테스트 실행

```bash
npm test
```

**실행 결과:**
- 모든 테스트 스위트 실행
- 현재: 97개 테스트 (모두 통과)

### 2. 특정 테스트 파일만 실행

```bash
# 헬스 체크 API 테스트만 실행
npm test -- tests/integration/api/health.test.js

# 주문 API 테스트만 실행
npm test -- tests/integration/api/orders.test.js

# 메뉴 API 테스트만 실행
npm test -- tests/integration/api/menus.test.js
```

### 3. 특정 테스트 케이스만 실행

```bash
# TC-H1로 시작하는 테스트만 실행
npm test -- --testNamePattern="TC-H1"

# TC-O1로 시작하는 테스트만 실행
npm test -- --testNamePattern="TC-O1"
```

### 4. Watch 모드 실행

파일 변경 시 자동으로 테스트가 재실행됩니다.

```bash
npm run test:watch
```

### 5. 커버리지 리포트 생성

```bash
npm run test:coverage
```

**결과 확인:**
- 터미널에 커버리지 요약 출력
- 상세 리포트: `coverage/index.html` 파일 열기
- 또는 `coverage/lcov-report/index.html` 브라우저에서 열기

---

## 📊 테스트 구조

### 통합 테스트 (Integration Tests)

```
tests/integration/api/
├── health.test.js      # 헬스 체크 API (9개 테스트)
├── menus.test.js       # 메뉴 API (13개 테스트)
├── orders.test.js      # 주문 API (32개 테스트)
└── admin.test.js       # 관리자 API (9개 테스트)
```

### 단위 테스트 (Unit Tests)

```
tests/unit/
├── controllers/
│   └── menuController.test.js
└── models/
    ├── Menu.test.js
    ├── Order.test.js
    ├── OrderItem.test.js
    └── User.test.js
```

---

## 🔍 테스트 실행 예시

### 예시 1: 헬스 체크 API 테스트만 실행

```bash
npm test -- tests/integration/api/health.test.js
```

**예상 출력:**
```
PASS tests/integration/api/health.test.js
  Health Check API
    GET /api/health
      √ TC-H1.1: should return HTTP 200 status code
      √ TC-H1.2: should return response body as object
      √ TC-H1.3: should return Content-Type as application/json
      √ TC-H2.1: should return response with status field
      √ TC-H2.2: should return response with message field
      √ TC-H3.1: should return status as string
      √ TC-H3.2: should return message as string
      √ TC-H4.1: should return status as "OK"
      √ TC-H4.2: should return non-empty message

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

### 예시 2: 특정 테스트 케이스 실행

```bash
npm test -- --testNamePattern="TC-H1"
```

**예상 출력:**
```
PASS tests/integration/api/health.test.js
  Health Check API
    GET /api/health
      √ TC-H1.1: should return HTTP 200 status code
      √ TC-H1.2: should return response body as object
      √ TC-H1.3: should return Content-Type as application/json
```

### 예시 3: 커버리지 리포트 생성

```bash
npm run test:coverage
```

**예상 출력:**
```
Test Suites: 9 passed, 9 total
Tests:       97 passed, 97 total

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   72.52 |    76.69 |   80.00 |   72.72 |
...
```

---

## 🛠️ 문제 해결

### 테스트가 실행되지 않는 경우

1. **의존성 확인:**
```bash
npm install
```

2. **Jest 캐시 클리어:**
```bash
npm test -- --clearCache
```

3. **Node 버전 확인:**
```bash
node --version  # Node.js 14 이상 필요
```

### 서버가 실행되지 않는 경우

1. **포트 확인:**
   - 기본 포트: 3000
   - 다른 애플리케이션이 사용 중인지 확인

2. **환경 변수 확인:**
   - `.env` 파일이 올바르게 설정되었는지 확인
   - 더미 모드 사용 시: `.env` 파일 없이도 실행 가능

---

## 📝 빠른 참조

### 애플리케이션 실행
```bash
npm run dev      # 개발 모드 (자동 재시작)
npm start        # 프로덕션 모드
```

### 테스트 실행
```bash
npm test                              # 모든 테스트
npm test -- --testNamePattern="TC-H"  # 특정 패턴
npm run test:watch                    # Watch 모드
npm run test:coverage                 # 커버리지 리포트
```

### 주요 URL
- 프론트엔드: `http://localhost:3000/`
- Health Check: `http://localhost:3000/api/health`
- 메뉴 API: `http://localhost:3000/api/menus`
- 주문 API: `http://localhost:3000/api/orders`

---

**마지막 업데이트**: 2025-11-01

