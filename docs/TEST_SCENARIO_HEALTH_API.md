# 헬스 체크 API 테스트 시나리오 문서

## 목표
TEST_SUMMARY.md 139-140 라인의 **헬스 체크 API** 테스트를 최소 단위로 세분화하여 구현

---

## 현재 상황 분석

### 현재 테스트 구조
```javascript
// 현재: 1개 테스트로 통합되어 있음
it('should return health status', async () => {
  const response = await request(app)
    .get('/api/health')
    .expect(200);

  expect(response.body).toHaveProperty('status');
  expect(response.body).toHaveProperty('message');
  expect(response.body.status).toBe('OK');
});
```

### 문제점
- 하나의 테스트에 여러 검증이 포함되어 있어 최소 단위가 아님
- 각 검증 항목을 독립적으로 테스트할 수 없음
- 테스트 실패 시 어떤 검증이 실패했는지 명확하지 않음

### API 구현 확인
```javascript
// backend/server.js
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OrderBean API is running' });
});
```

**응답 구조**:
- HTTP 상태 코드: 200
- Content-Type: application/json
- 응답 본문:
  ```json
  {
    "status": "OK",
    "message": "OrderBean API is running"
  }
  ```

---

## 구현 시나리오

### 시나리오: 최소 단위 테스트로 세분화

#### TC-H1: HTTP 응답 기본 검증

**TC-H1.1**: HTTP 상태 코드 검증
- **목표**: GET /api/health 요청 시 HTTP 200 상태 코드 반환 확인
- **검증 항목**: `response.status === 200`

**TC-H1.2**: 응답 본문 타입 검증
- **목표**: 응답 본문이 객체 타입인지 확인
- **검증 항목**: `typeof response.body === 'object'`

**TC-H1.3**: Content-Type 헤더 검증
- **목표**: 응답의 Content-Type이 application/json인지 확인
- **검증 항목**: `response.headers['content-type']`이 JSON 형식인지 확인

---

#### TC-H2: 응답 필드 존재 확인

**TC-H2.1**: status 필드 존재 확인
- **목표**: 응답 본문에 status 필드가 존재하는지 확인
- **검증 항목**: `response.body.hasOwnProperty('status')` 또는 `'status' in response.body`

**TC-H2.2**: message 필드 존재 확인
- **목표**: 응답 본문에 message 필드가 존재하는지 확인
- **검증 항목**: `response.body.hasOwnProperty('message')` 또는 `'message' in response.body`

---

#### TC-H3: 필드 타입 검증

**TC-H3.1**: status 필드 타입 검증
- **목표**: status 필드가 문자열 타입인지 확인
- **검증 항목**: `typeof response.body.status === 'string'`

**TC-H3.2**: message 필드 타입 검증
- **목표**: message 필드가 문자열 타입인지 확인
- **검증 항목**: `typeof response.body.message === 'string'`

---

#### TC-H4: 필드 값 검증

**TC-H4.1**: status 값 검증
- **목표**: status 필드의 값이 'OK'인지 확인
- **검증 항목**: `response.body.status === 'OK'`

**TC-H4.2**: message 값 검증
- **목표**: message 필드가 비어있지 않은 문자열인지 확인
- **검증 항목**: `response.body.message.length > 0`

---

## 최종 테스트 구조

```
헬스 체크 API (8개 테스트) - 최소 단위로 세분화
├── TC-H1: HTTP 응답 기본 검증 (3개)
│   ├── TC-H1.1: HTTP 상태 코드 검증
│   ├── TC-H1.2: 응답 본문 타입 검증
│   └── TC-H1.3: Content-Type 헤더 검증
├── TC-H2: 응답 필드 존재 확인 (2개)
│   ├── TC-H2.1: status 필드 존재 확인
│   └── TC-H2.2: message 필드 존재 확인
├── TC-H3: 필드 타입 검증 (2개)
│   ├── TC-H3.1: status 필드 타입 검증
│   └── TC-H3.2: message 필드 타입 검증
└── TC-H4: 필드 값 검증 (2개)
    ├── TC-H4.1: status 값 검증
    └── TC-H4.2: message 값 검증
```

---

## 구현 방법

### 테스트 파일 구조
```javascript
describe('Health Check API', () => {
  describe('GET /api/health', () => {
    // TC-H1: HTTP 응답 기본 검증
    describe('TC-H1: HTTP 응답 기본 검증', () => {
      it('TC-H1.1: should return HTTP 200 status code', ...);
      it('TC-H1.2: should return response body as object', ...);
      it('TC-H1.3: should return Content-Type as application/json', ...);
    });

    // TC-H2: 응답 필드 존재 확인
    describe('TC-H2: 응답 필드 존재 확인', () => {
      it('TC-H2.1: should return response with status field', ...);
      it('TC-H2.2: should return response with message field', ...);
    });

    // TC-H3: 필드 타입 검증
    describe('TC-H3: 필드 타입 검증', () => {
      it('TC-H3.1: should return status as string', ...);
      it('TC-H3.2: should return message as string', ...);
    });

    // TC-H4: 필드 값 검증
    describe('TC-H4: 필드 값 검증', () => {
      it('TC-H4.1: should return status as "OK"', ...);
      it('TC-H4.2: should return non-empty message', ...);
    });
  });
});
```

---

## 예상 결과

### 테스트 실행 전
```
헬스 체크 API (1개 테스트)
- ✅ GET /api/health - 헬스 상태 반환
```

### 테스트 실행 후
```
헬스 체크 API (8개 테스트) - 최소 단위로 세분화
- ✅ TC-H1.1: HTTP 상태 코드 검증
- ✅ TC-H1.2: 응답 본문 타입 검증
- ✅ TC-H1.3: Content-Type 헤더 검증
- ✅ TC-H2.1: status 필드 존재 확인
- ✅ TC-H2.2: message 필드 존재 확인
- ✅ TC-H3.1: status 필드 타입 검증
- ✅ TC-H3.2: message 필드 타입 검증
- ✅ TC-H4.1: status 값 검증
- ✅ TC-H4.2: message 값 검증
```

---

## 구현 시 주의사항

1. **테스트 독립성**: 각 테스트는 독립적으로 실행 가능해야 함
2. **명확한 검증**: 각 테스트는 하나의 검증만 수행
3. **기존 테스트 대체**: 기존 통합 테스트를 세분화된 테스트로 대체
4. **테스트 이름**: TC-H1.1 형식으로 명확한 테스트 케이스 번호 사용

---

## 장점

1. **명확한 실패 원인**: 어떤 검증이 실패했는지 즉시 파악 가능
2. **유지보수 용이**: 각 검증을 독립적으로 수정 가능
3. **테스트 커버리지 향상**: 각 검증 항목을 명확히 확인
4. **일관성**: 다른 API 테스트와 동일한 패턴 유지

---

## 승인 요청

위 시나리오로 진행할까요? 승인해주시면 구현을 시작하겠습니다.

**구현 예상 시간**: 약 15분
**영향 범위**: `tests/integration/api/health.test.js` 파일 수정
**테스트 수**: 1개 → 8개 (최소 단위로 세분화)

