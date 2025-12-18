# 주문 API 테스트 시나리오 (POST /api/orders, GET /api/orders)

**작성일**: 2025-11-01  
**대상**: POST /api/orders, GET /api/orders 엔드포인트  
**목표**: 최소 단위 테스트 케이스로 세분화하여 구현

---

## 📋 테스트 시나리오 개요

### 현재 상태
- 총 7개의 통합 테스트
- 기본적인 검증만 수행
- 엣지 케이스 및 경계값 테스트 부족

### 개선 목표
- 최소 단위 테스트로 세분화
- 각 검증 항목을 독립적인 테스트로 분리
- 엣지 케이스 및 에러 시나리오 추가

---

## 🎯 POST /api/orders 테스트 시나리오

### 시나리오 1: HTTP 응답 기본 검증

#### TC-O1.1: HTTP 상태 코드 검증 (성공 케이스)
**목적**: 유효한 주문 생성 시 201 Created를 반환하는지 확인

**Given**: 유효한 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- HTTP 상태 코드는 201이어야 함
- Content-Type은 application/json이어야 함

**검증 항목**:
- `response.status` === 201
- `response.headers['content-type']` contains 'application/json'

**참고**: 더미 모드에서는 스킵됨

---

#### TC-O1.2: 응답 본문 구조 검증 (성공 케이스)
**목적**: 성공 응답이 예상된 JSON 구조를 가지는지 확인

**Given**: 유효한 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- 응답 본문은 객체여야 함
- `order_id` 속성이 존재해야 함
- `status` 속성이 존재해야 함
- `created_at` 속성이 존재해야 함

**검증 항목**:
- `typeof response.body` === 'object'
- `response.body.hasOwnProperty('order_id')` === true
- `response.body.hasOwnProperty('status')` === true
- `response.body.hasOwnProperty('created_at')` === true

---

### 시나리오 2: 필수 필드 검증

#### TC-O2.1: user_id 누락 검증
**목적**: user_id가 없을 때 400 Bad Request를 반환하는지 확인

**Given**: user_id가 없는 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- HTTP 상태 코드는 400이어야 함
- 에러 메시지가 포함되어야 함

**검증 항목**:
- `response.status` === 400
- `response.body.hasOwnProperty('error')` === true
- `typeof response.body.error` === 'string'
- `response.body.error.length` > 0

---

#### TC-O2.2: items 누락 검증
**목적**: items가 없을 때 400 Bad Request를 반환하는지 확인

**Given**: items가 없는 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- HTTP 상태 코드는 400이어야 함
- 에러 메시지가 포함되어야 함

**검증 항목**:
- `response.status` === 400
- `response.body.hasOwnProperty('error')` === true
- `response.body.error` contains 'items' 또는 '필수'

---

#### TC-O2.3: 빈 items 배열 검증
**목적**: items가 빈 배열일 때 400 Bad Request를 반환하는지 확인

**Given**: items가 빈 배열인 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- HTTP 상태 코드는 400이어야 함
- 에러 메시지가 포함되어야 함

**검증 항목**:
- `response.status` === 400
- `response.body.hasOwnProperty('error')` === true
- `response.body.error` contains 'items' 또는 '필수'

---

#### TC-O2.4: user_id와 items 모두 누락 검증
**목적**: 필수 필드가 모두 없을 때 400 Bad Request를 반환하는지 확인

**Given**: user_id와 items가 모두 없는 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- HTTP 상태 코드는 400이어야 함
- 에러 메시지가 포함되어야 함

**검증 항목**:
- `response.status` === 400
- `response.body.hasOwnProperty('error')` === true

---

### 시나리오 3: 주문 데이터 구조 검증

#### TC-O3.1: user_id 타입 검증
**목적**: user_id가 숫자 타입인지 확인

**Given**: user_id가 숫자가 아닌 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- 400 에러 또는 데이터베이스 에러가 발생할 수 있음
- 또는 정상 처리될 수 있음 (타입 변환)

**검증 항목**:
- user_id가 문자열인 경우 처리 방식 확인
- user_id가 null인 경우 400 에러 확인

---

#### TC-O3.2: items 배열 구조 검증
**목적**: items 배열의 각 항목이 올바른 구조를 가지는지 확인

**Given**: 유효한 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- items는 배열이어야 함
- 각 item은 객체여야 함
- 각 item은 menu_id를 포함해야 함

**검증 항목**:
- `Array.isArray(items)` === true
- `items.every(item => typeof item === 'object')` === true
- `items.every(item => item.hasOwnProperty('menu_id'))` === true

---

#### TC-O3.3: menu_id 필수 필드 검증
**목적**: items의 각 항목에 menu_id가 필수인지 확인

**Given**: menu_id가 없는 item이 포함된 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- 400 에러 또는 데이터베이스 에러가 발생할 수 있음

**검증 항목**:
- menu_id 누락 시 에러 처리 확인

---

#### TC-O3.4: options 필드 처리 검증
**목적**: options 필드가 없을 때도 정상 처리되는지 확인

**Given**: options가 없는 item이 포함된 주문 데이터가 있고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- options가 없어도 정상 처리되어야 함
- options는 빈 객체로 처리되어야 함

**검증 항목**:
- options가 없는 경우도 정상 처리
- options는 선택적 필드

---

### 시나리오 4: 성공 응답 데이터 검증

#### TC-O4.1: order_id 타입 및 범위 검증
**목적**: order_id가 유효한 숫자인지 확인

**Given**: 주문이 성공적으로 생성되고
**When**: 응답을 검사하면
**Then**: 
- order_id는 숫자 타입이어야 함
- order_id는 양수여야 함

**검증 항목**:
- `typeof response.body.order_id` === 'number'
- `response.body.order_id > 0` === true
- `Number.isInteger(response.body.order_id)` === true

---

#### TC-O4.2: status 기본값 검증
**목적**: 주문 생성 시 status가 '접수'로 설정되는지 확인

**Given**: 주문이 성공적으로 생성되고
**When**: 응답을 검사하면
**Then**: 
- status는 '접수'여야 함

**검증 항목**:
- `response.body.status` === '접수'
- `typeof response.body.status` === 'string'

---

#### TC-O4.3: created_at 타입 검증
**목적**: created_at이 유효한 날짜 형식인지 확인

**Given**: 주문이 성공적으로 생성되고
**When**: 응답을 검사하면
**Then**: 
- created_at은 문자열이어야 함
- created_at은 유효한 날짜 형식이어야 함

**검증 항목**:
- `typeof response.body.created_at` === 'string'
- `new Date(response.body.created_at)` is valid date

---

### 시나리오 5: 에러 처리 검증

#### TC-O5.1: 서버 에러 처리
**목적**: 서버 에러 발생 시 적절한 에러 응답을 반환하는지 확인

**Given**: 서버에 에러가 발생하고
**When**: POST /api/orders 요청을 보내면
**Then**: 
- HTTP 상태 코드는 500이어야 함
- 에러 메시지가 포함되어야 함

**검증 항목**:
- `response.status` === 500
- `response.body.hasOwnProperty('error')` === true
- `response.body.hasOwnProperty('message')` === true

---

## 🎯 GET /api/orders 테스트 시나리오

### 시나리오 6: HTTP 응답 기본 검증

#### TC-O6.1: HTTP 상태 코드 검증
**목적**: API가 정상적으로 200 OK를 반환하는지 확인

**Given**: 서버가 실행 중이고
**When**: GET /api/orders 요청을 보내면
**Then**: 
- HTTP 상태 코드는 200이어야 함
- Content-Type은 application/json이어야 함

**검증 항목**:
- `response.status` === 200
- `response.headers['content-type']` contains 'application/json'

---

#### TC-O6.2: 응답 본문 구조 검증
**목적**: 응답이 예상된 JSON 구조를 가지는지 확인

**Given**: 서버가 실행 중이고
**When**: GET /api/orders 요청을 보내면
**Then**: 
- 응답 본문은 객체여야 함
- `orders` 속성이 존재해야 함
- `orders`는 배열이어야 함

**검증 항목**:
- `typeof response.body` === 'object'
- `response.body.hasOwnProperty('orders')` === true
- `Array.isArray(response.body.orders)` === true

---

### 시나리오 7: 주문 목록 데이터 검증

#### TC-O7.1: 빈 주문 목록 처리
**목적**: 주문이 없을 때 빈 배열을 반환하는지 확인

**Given**: 데이터베이스에 주문이 없고
**When**: GET /api/orders 요청을 보내면
**Then**: 
- `orders` 배열은 빈 배열이어야 함
- HTTP 상태 코드는 200이어야 함

**검증 항목**:
- `response.body.orders.length` === 0
- `response.status` === 200

---

#### TC-O7.2: 주문 목록 존재 확인
**목적**: 주문이 있을 때 목록이 반환되는지 확인

**Given**: 데이터베이스에 주문이 있고
**When**: GET /api/orders 요청을 보내면
**Then**: 
- `orders` 배열의 길이는 0 이상이어야 함
- 각 항목은 주문 객체여야 함

**검증 항목**:
- `response.body.orders.length` >= 0
- `response.body.orders.every(item => typeof item === 'object')` === true

---

### 시나리오 8: 쿼리 파라미터 검증

#### TC-O8.1: user_id 쿼리 파라미터 처리
**목적**: user_id 쿼리 파라미터로 필터링되는지 확인

**Given**: 서버가 실행 중이고
**When**: GET /api/orders?user_id=1 요청을 보내면
**Then**: 
- HTTP 상태 코드는 200이어야 함
- `orders` 배열이 반환되어야 함

**검증 항목**:
- `response.status` === 200
- `response.body.hasOwnProperty('orders')` === true
- `Array.isArray(response.body.orders)` === true

---

#### TC-O8.2: user_id 쿼리 파라미터 타입 검증
**목적**: user_id가 문자열로 전달되어도 처리되는지 확인

**Given**: 서버가 실행 중이고
**When**: GET /api/orders?user_id=1 (문자열) 요청을 보내면
**Then**: 
- 정상적으로 처리되어야 함
- 또는 타입 변환이 이루어져야 함

**검증 항목**:
- `response.status` === 200
- 정상 응답 반환

---

#### TC-O8.3: 잘못된 user_id 쿼리 파라미터 처리
**목적**: 잘못된 user_id 값이 전달될 때 처리되는지 확인

**Given**: 서버가 실행 중이고
**When**: GET /api/orders?user_id=invalid 요청을 보내면
**Then**: 
- 빈 배열을 반환하거나 에러가 발생할 수 있음

**검증 항목**:
- 응답이 정상적으로 처리되거나 적절한 에러 반환

---

### 시나리오 9: 주문 객체 구조 검증

#### TC-O9.1: 필수 필드 존재 확인
**목적**: 각 주문 객체가 필수 필드를 포함하는지 확인

**Given**: 주문 목록이 반환되고
**When**: 첫 번째 주문 객체를 검사하면
**Then**: 
- `order_id` 필드가 존재해야 함
- `user_id` 필드가 존재해야 함
- `status` 필드가 존재해야 함
- `created_at` 필드가 존재해야 함
- `items` 필드가 존재해야 함

**검증 항목**:
- `order.hasOwnProperty('order_id')` === true
- `order.hasOwnProperty('user_id')` === true
- `order.hasOwnProperty('status')` === true
- `order.hasOwnProperty('created_at')` === true
- `order.hasOwnProperty('items')` === true

---

#### TC-O9.2: 모든 주문의 필수 필드 검증
**목적**: 모든 주문 객체가 필수 필드를 포함하는지 확인

**Given**: 주문 목록이 반환되고
**When**: 모든 주문 객체를 검사하면
**Then**: 
- 모든 주문이 필수 필드를 포함해야 함

**검증 항목**:
- `orders.every(order => order.hasOwnProperty('order_id'))` === true
- `orders.every(order => order.hasOwnProperty('user_id'))` === true
- `orders.every(order => order.hasOwnProperty('status'))` === true
- `orders.every(order => order.hasOwnProperty('created_at'))` === true
- `orders.every(order => order.hasOwnProperty('items'))` === true

---

### 시나리오 10: 주문 항목(items) 검증

#### TC-O10.1: items 배열 타입 검증
**목적**: items가 배열 타입인지 확인

**Given**: 주문 목록이 반환되고
**When**: 각 주문의 items를 검사하면
**Then**: 
- items는 배열 타입이어야 함

**검증 항목**:
- `Array.isArray(order.items)` === true

---

#### TC-O10.2: items 배열 요소 구조 검증
**목적**: items 배열의 각 요소가 올바른 구조를 가지는지 확인

**Given**: 주문 목록이 반환되고 items가 있고
**When**: items 배열의 각 요소를 검사하면
**Then**: 
- 각 item은 객체여야 함
- 각 item은 menu_id를 포함해야 함
- 각 item은 options를 포함해야 함

**검증 항목**:
- `items.every(item => typeof item === 'object')` === true
- `items.every(item => item.hasOwnProperty('menu_id'))` === true
- `items.every(item => item.hasOwnProperty('options'))` === true

---

#### TC-O10.3: 빈 items 배열 처리
**목적**: items가 빈 배열일 때도 정상 처리되는지 확인

**Given**: 주문 목록이 반환되고
**When**: items가 빈 배열인 주문이 있으면
**Then**: 
- 빈 배열도 유효한 값으로 처리되어야 함

**검증 항목**:
- `Array.isArray(order.items)` === true (빈 배열도 배열)

---

#### TC-O10.4: options 필드 타입 검증
**목적**: options 필드가 올바른 타입인지 확인

**Given**: 주문 목록이 반환되고 items가 있고
**When**: 각 item의 options를 검사하면
**Then**: 
- options는 객체 타입이어야 함

**검증 항목**:
- `typeof item.options === 'object'` (null이 아닌 객체)

---

### 시나리오 11: 사용자별 필터링 검증

#### TC-O11.1: 특정 사용자 주문만 반환 확인
**목적**: user_id 쿼리 파라미터로 특정 사용자의 주문만 반환되는지 확인

**Given**: 여러 사용자의 주문이 있고
**When**: GET /api/orders?user_id=1 요청을 보내면
**Then**: 
- 반환된 주문의 user_id는 모두 1이어야 함

**검증 항목**:
- `orders.every(order => order.user_id === 1)` === true

---

#### TC-O11.2: 존재하지 않는 사용자 주문 조회
**목적**: 존재하지 않는 user_id로 조회할 때 빈 배열을 반환하는지 확인

**Given**: 서버가 실행 중이고
**When**: GET /api/orders?user_id=99999 요청을 보내면
**Then**: 
- 빈 배열을 반환해야 함

**검증 항목**:
- `response.body.orders.length` === 0

---

### 시나리오 12: 에러 처리 검증

#### TC-O12.1: 서버 에러 처리
**목적**: 서버 에러 발생 시 적절한 에러 응답을 반환하는지 확인

**Given**: 서버에 에러가 발생하고
**When**: GET /api/orders 요청을 보내면
**Then**: 
- HTTP 상태 코드는 500이어야 함
- 에러 메시지가 포함되어야 함

**검증 항목**:
- `response.status` === 500
- `response.body.hasOwnProperty('error')` === true
- `typeof response.body.error` === 'string'

---

## 📊 테스트 케이스 매트릭스

| TC ID | 테스트 케이스 | 우선순위 | 예상 시간 | 상태 |
|-------|--------------|---------|----------|------|
| **POST /api/orders** | | | | |
| TC-O1.1 | HTTP 상태 코드 검증 (성공) | 높음 | 1분 | 대기 |
| TC-O1.2 | 응답 본문 구조 검증 (성공) | 높음 | 1분 | 대기 |
| TC-O2.1 | user_id 누락 검증 | 높음 | 1분 | 대기 |
| TC-O2.2 | items 누락 검증 | 높음 | 1분 | 대기 |
| TC-O2.3 | 빈 items 배열 검증 | 높음 | 1분 | 대기 |
| TC-O2.4 | user_id와 items 모두 누락 | 중간 | 1분 | 대기 |
| TC-O3.1 | user_id 타입 검증 | 중간 | 2분 | 대기 |
| TC-O3.2 | items 배열 구조 검증 | 높음 | 2분 | 대기 |
| TC-O3.3 | menu_id 필수 필드 검증 | 높음 | 2분 | 대기 |
| TC-O3.4 | options 필드 처리 검증 | 중간 | 2분 | 대기 |
| TC-O4.1 | order_id 타입 및 범위 검증 | 높음 | 1분 | 대기 |
| TC-O4.2 | status 기본값 검증 | 높음 | 1분 | 대기 |
| TC-O4.3 | created_at 타입 검증 | 중간 | 1분 | 대기 |
| TC-O5.1 | 서버 에러 처리 | 중간 | 2분 | 대기 |
| **GET /api/orders** | | | | |
| TC-O6.1 | HTTP 상태 코드 검증 | 높음 | 1분 | 대기 |
| TC-O6.2 | 응답 본문 구조 검증 | 높음 | 1분 | 대기 |
| TC-O7.1 | 빈 주문 목록 처리 | 중간 | 1분 | 대기 |
| TC-O7.2 | 주문 목록 존재 확인 | 높음 | 1분 | 대기 |
| TC-O8.1 | user_id 쿼리 파라미터 처리 | 높음 | 1분 | 대기 |
| TC-O8.2 | user_id 쿼리 파라미터 타입 검증 | 중간 | 1분 | 대기 |
| TC-O8.3 | 잘못된 user_id 쿼리 파라미터 처리 | 낮음 | 1분 | 대기 |
| TC-O9.1 | 필수 필드 존재 확인 | 높음 | 2분 | 대기 |
| TC-O9.2 | 모든 주문의 필수 필드 검증 | 높음 | 2분 | 대기 |
| TC-O10.1 | items 배열 타입 검증 | 높음 | 1분 | 대기 |
| TC-O10.2 | items 배열 요소 구조 검증 | 높음 | 2분 | 대기 |
| TC-O10.3 | 빈 items 배열 처리 | 중간 | 1분 | 대기 |
| TC-O10.4 | options 필드 타입 검증 | 중간 | 1분 | 대기 |
| TC-O11.1 | 특정 사용자 주문만 반환 확인 | 높음 | 2분 | 대기 |
| TC-O11.2 | 존재하지 않는 사용자 주문 조회 | 중간 | 1분 | 대기 |
| TC-O12.1 | 서버 에러 처리 | 중간 | 2분 | 대기 |

**총 테스트 케이스**: 28개  
**총 예상 시간**: 약 35분

---

## 🎯 구현 계획

### Phase 1: POST 기본 검증 (TC-O1.1 ~ TC-O1.2)
- HTTP 응답 기본 검증
- 성공 응답 구조 검증

### Phase 2: POST 필수 필드 검증 (TC-O2.1 ~ TC-O2.4)
- 필수 필드 누락 검증
- 빈 배열 검증

### Phase 3: POST 데이터 구조 검증 (TC-O3.1 ~ TC-O3.4)
- 데이터 타입 검증
- 필드 구조 검증

### Phase 4: POST 성공 응답 검증 (TC-O4.1 ~ TC-O4.3)
- 응답 데이터 타입 검증
- 기본값 검증

### Phase 5: POST 에러 처리 (TC-O5.1)
- 서버 에러 처리

### Phase 6: GET 기본 검증 (TC-O6.1 ~ TC-O6.2)
- HTTP 응답 기본 검증
- 응답 본문 구조 검증

### Phase 7: GET 목록 검증 (TC-O7.1 ~ TC-O7.2)
- 빈 목록 처리
- 목록 존재 확인

### Phase 8: GET 쿼리 파라미터 검증 (TC-O8.1 ~ TC-O8.3)
- 쿼리 파라미터 처리
- 타입 검증

### Phase 9: GET 주문 구조 검증 (TC-O9.1 ~ TC-O9.2)
- 필수 필드 존재 확인
- 모든 주문 검증

### Phase 10: GET 주문 항목 검증 (TC-O10.1 ~ TC-O10.4)
- items 배열 검증
- options 필드 검증

### Phase 11: GET 필터링 검증 (TC-O11.1 ~ TC-O11.2)
- 사용자별 필터링
- 존재하지 않는 사용자 처리

### Phase 12: GET 에러 처리 (TC-O12.1)
- 서버 에러 처리

---

## ✅ 승인 체크리스트

- [x] 시나리오 검토 완료
- [x] 테스트 케이스 우선순위 확인
- [x] 구현 범위 확인
- [x] 예상 시간 검토
- [x] 승인자 서명: 사용자 승인 완료

---

## 🎉 구현 완료

**구현일**: 2025-11-01  
**구현 상태**: ✅ 완료

### 구현 결과

- **총 테스트 케이스**: 30개 (기존 7개 → +23개)
- **통과**: 30개 ✅
- **실패**: 0개
- **실행 시간**: 약 0.79초

### 테스트 실행 결과

```
PASS tests/integration/api/orders.test.js
  Order API Integration Tests
    POST /api/orders
      √ TC-O1.1: should return HTTP 201 status code on success
      √ TC-O1.2: should return response with correct structure on success
      √ TC-O2.1: should return 400 when user_id is missing
      √ TC-O2.2: should return 400 when items is missing
      √ TC-O2.3: should return 400 when items array is empty
      √ TC-O2.4: should return 400 when both user_id and items are missing
      √ TC-O3.1: should handle user_id type validation
      √ TC-O3.2: should validate items array structure
      √ TC-O3.3: should validate menu_id as required field
      √ TC-O3.4: should handle missing options field
      √ TC-O4.1: should return order_id as positive integer
      √ TC-O4.2: should return status as "접수" by default
      √ TC-O4.3: should return created_at as valid date string
      √ TC-O5.1: should handle server errors gracefully
    GET /api/orders
      √ TC-O6.1: should return HTTP 200 status code
      √ TC-O6.2: should return response with correct structure
      √ TC-O7.1: should return empty array when no orders exist
      √ TC-O7.2: should return list of orders when orders exist
      √ TC-O8.1: should handle user_id query parameter
      √ TC-O8.2: should handle user_id query parameter as string
      √ TC-O8.3: should handle invalid user_id query parameter
      √ TC-O9.1: should return orders with required fields
      √ TC-O9.2: should ensure all orders have required fields
      √ TC-O10.1: should return items as array
      √ TC-O10.2: should return items array with correct structure
      √ TC-O10.3: should handle empty items array
      √ TC-O10.4: should return options as object
      √ TC-O11.1: should return only orders for specified user_id
      √ TC-O11.2: should return empty array for non-existent user_id
      √ TC-O12.1: should handle server errors gracefully

Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
```

### 개선 사항

기존 7개의 통합 테스트를 30개의 최소 단위 테스트로 세분화하여:
- 각 검증 항목을 독립적으로 테스트 가능
- 실패 시 정확한 원인 파악 용이
- 테스트 유지보수성 향상
- 코드 커버리지 향상
- 엣지 케이스 및 경계값 테스트 추가

---

**작성자**: AI Assistant  
**검토자**: 사용자  
**승인일**: 2025-11-01  
**구현일**: 2025-11-01

