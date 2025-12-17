# 메뉴 API 테스트 시나리오 (GET /api/menus)

**작성일**: 2025-11-01  
**대상**: GET /api/menus 엔드포인트  
**목표**: 최소 단위 테스트 케이스로 세분화하여 구현

---

## 📋 테스트 시나리오 개요

### 현재 상태
- 총 3개의 통합 테스트
- 기본적인 검증만 수행
- 엣지 케이스 및 경계값 테스트 부족

### 개선 목표
- 최소 단위 테스트로 세분화
- 각 검증 항목을 독립적인 테스트로 분리
- 엣지 케이스 및 에러 시나리오 추가

---

## 🎯 테스트 시나리오 상세

### 시나리오 1: HTTP 응답 기본 검증

#### TC-1.1: HTTP 상태 코드 검증
**목적**: API가 정상적으로 200 OK를 반환하는지 확인

**Given**: 서버가 실행 중이고
**When**: GET /api/menus 요청을 보내면
**Then**: 
- HTTP 상태 코드는 200이어야 함
- Content-Type은 application/json이어야 함

**검증 항목**:
- `response.status` === 200
- `response.headers['content-type']` contains 'application/json'

---

#### TC-1.2: 응답 본문 구조 검증
**목적**: 응답이 예상된 JSON 구조를 가지는지 확인

**Given**: 서버가 실행 중이고
**When**: GET /api/menus 요청을 보내면
**Then**: 
- 응답 본문은 객체여야 함
- `menus` 속성이 존재해야 함
- `menus`는 배열이어야 함

**검증 항목**:
- `typeof response.body` === 'object'
- `response.body.hasOwnProperty('menus')` === true
- `Array.isArray(response.body.menus)` === true

---

### 시나리오 2: 메뉴 목록 데이터 검증

#### TC-2.1: 빈 메뉴 목록 처리
**목적**: 메뉴가 없을 때 빈 배열을 반환하는지 확인

**Given**: 데이터베이스에 메뉴가 없고
**When**: GET /api/menus 요청을 보내면
**Then**: 
- `menus` 배열은 빈 배열이어야 함
- HTTP 상태 코드는 200이어야 함

**검증 항목**:
- `response.body.menus.length` === 0
- `response.status` === 200

---

#### TC-2.2: 메뉴 목록 존재 확인
**목적**: 메뉴가 있을 때 목록이 반환되는지 확인

**Given**: 데이터베이스에 메뉴가 있고
**When**: GET /api/menus 요청을 보내면
**Then**: 
- `menus` 배열의 길이는 0보다 커야 함
- 각 항목은 메뉴 객체여야 함

**검증 항목**:
- `response.body.menus.length` > 0
- `response.body.menus.every(item => typeof item === 'object')` === true

---

### 시나리오 3: 메뉴 객체 구조 검증

#### TC-3.1: 필수 필드 존재 확인
**목적**: 각 메뉴 객체가 필수 필드를 포함하는지 확인

**Given**: 메뉴 목록이 반환되고
**When**: 첫 번째 메뉴 객체를 검사하면
**Then**: 
- `menu_id` 필드가 존재해야 함
- `name` 필드가 존재해야 함
- `price` 필드가 존재해야 함
- `options` 필드가 존재해야 함

**검증 항목**:
- `menu.hasOwnProperty('menu_id')` === true
- `menu.hasOwnProperty('name')` === true
- `menu.hasOwnProperty('price')` === true
- `menu.hasOwnProperty('options')` === true

---

#### TC-3.2: 필수 필드 누락 검증
**목적**: 모든 메뉴 객체가 필수 필드를 포함하는지 확인

**Given**: 메뉴 목록이 반환되고
**When**: 모든 메뉴 객체를 검사하면
**Then**: 
- 모든 메뉴가 필수 필드를 포함해야 함

**검증 항목**:
- `menus.every(menu => menu.hasOwnProperty('menu_id'))` === true
- `menus.every(menu => menu.hasOwnProperty('name'))` === true
- `menus.every(menu => menu.hasOwnProperty('price'))` === true
- `menus.every(menu => menu.hasOwnProperty('options'))` === true

---

### 시나리오 4: 데이터 타입 검증

#### TC-4.1: menu_id 타입 검증
**목적**: menu_id가 숫자 타입인지 확인

**Given**: 메뉴 목록이 반환되고
**When**: 각 메뉴의 menu_id를 검사하면
**Then**: 
- `menu_id`는 숫자 타입이어야 함
- `menu_id`는 양수여야 함

**검증 항목**:
- `typeof menu.menu_id` === 'number'
- `Number.isInteger(menu.menu_id)` === true
- `menu.menu_id > 0` === true

---

#### TC-4.2: name 타입 검증
**목적**: name이 문자열 타입인지 확인

**Given**: 메뉴 목록이 반환되고
**When**: 각 메뉴의 name을 검사하면
**Then**: 
- `name`은 문자열 타입이어야 함
- `name`은 빈 문자열이 아니어야 함

**검증 항목**:
- `typeof menu.name` === 'string'
- `menu.name.length > 0` === true

---

#### TC-4.3: price 타입 및 범위 검증
**목적**: price가 유효한 숫자이고 양수인지 확인

**Given**: 메뉴 목록이 반환되고
**When**: 각 메뉴의 price를 검사하면
**Then**: 
- `price`는 숫자 타입이어야 함
- `price`는 양수여야 함
- `price`는 정수 또는 실수일 수 있음

**검증 항목**:
- `typeof menu.price` === 'number'
- `menu.price > 0` === true
- `!isNaN(menu.price)` === true
- `isFinite(menu.price)` === true

---

#### TC-4.4: options 타입 검증
**목적**: options가 배열 타입인지 확인

**Given**: 메뉴 목록이 반환되고
**When**: 각 메뉴의 options를 검사하면
**Then**: 
- `options`는 배열 타입이어야 함

**검증 항목**:
- `Array.isArray(menu.options)` === true

---

### 시나리오 5: options 배열 상세 검증

#### TC-5.1: options 배열 요소 검증
**목적**: options 배열의 각 요소가 문자열인지 확인

**Given**: 메뉴 목록이 반환되고 options 배열이 있고
**When**: options 배열의 각 요소를 검사하면
**Then**: 
- 모든 요소는 문자열 타입이어야 함

**검증 항목**:
- `menu.options.every(opt => typeof opt === 'string')` === true

---

#### TC-5.2: 빈 options 배열 처리
**목적**: options가 빈 배열일 때도 정상 처리되는지 확인

**Given**: 메뉴 목록이 반환되고
**When**: options가 빈 배열인 메뉴가 있으면
**Then**: 
- 빈 배열도 유효한 값으로 처리되어야 함

**검증 항목**:
- `Array.isArray(menu.options)` === true (빈 배열도 배열)

---

### 시나리오 6: 에러 처리 검증

#### TC-6.1: 서버 에러 처리
**목적**: 서버 에러 발생 시 적절한 에러 응답을 반환하는지 확인

**Given**: 서버에 에러가 발생하고
**When**: GET /api/menus 요청을 보내면
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
| TC-1.1 | HTTP 상태 코드 검증 | 높음 | 1분 | 대기 |
| TC-1.2 | 응답 본문 구조 검증 | 높음 | 1분 | 대기 |
| TC-2.1 | 빈 메뉴 목록 처리 | 중간 | 1분 | 대기 |
| TC-2.2 | 메뉴 목록 존재 확인 | 높음 | 1분 | 대기 |
| TC-3.1 | 필수 필드 존재 확인 | 높음 | 2분 | 대기 |
| TC-3.2 | 필수 필드 누락 검증 | 높음 | 2분 | 대기 |
| TC-4.1 | menu_id 타입 검증 | 높음 | 1분 | 대기 |
| TC-4.2 | name 타입 검증 | 높음 | 1분 | 대기 |
| TC-4.3 | price 타입 및 범위 검증 | 높음 | 2분 | 대기 |
| TC-4.4 | options 타입 검증 | 높음 | 1분 | 대기 |
| TC-5.1 | options 배열 요소 검증 | 중간 | 2분 | 대기 |
| TC-5.2 | 빈 options 배열 처리 | 낮음 | 1분 | 대기 |
| TC-6.1 | 서버 에러 처리 | 중간 | 2분 | 대기 |

**총 예상 시간**: 약 20분

---

## 🎯 구현 계획

### Phase 1: 기본 검증 (TC-1.1 ~ TC-1.2)
- HTTP 응답 기본 검증
- 응답 본문 구조 검증

### Phase 2: 데이터 검증 (TC-2.1 ~ TC-2.2)
- 빈 목록 처리
- 목록 존재 확인

### Phase 3: 구조 검증 (TC-3.1 ~ TC-3.2)
- 필수 필드 존재 확인
- 모든 객체 검증

### Phase 4: 타입 검증 (TC-4.1 ~ TC-4.4)
- 각 필드의 타입 검증
- 범위 및 유효성 검증

### Phase 5: 상세 검증 (TC-5.1 ~ TC-5.2)
- options 배열 상세 검증
- 엣지 케이스 처리

### Phase 6: 에러 처리 (TC-6.1)
- 에러 시나리오 검증

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

- **총 테스트 케이스**: 13개
- **통과**: 13개 ✅
- **실패**: 0개
- **실행 시간**: 약 0.78초

### 테스트 실행 결과

```
PASS tests/integration/api/menus.test.js
  Menu API Integration Tests
    GET /api/menus
      √ TC-1.1: should return HTTP 200 status code
      √ TC-1.2: should return response with correct structure
      √ TC-2.1: should return empty array when no menus exist
      √ TC-2.2: should return list of menus when menus exist
      √ TC-3.1: should return menus with required fields
      √ TC-3.2: should ensure all menus have required fields
      √ TC-4.1: should return menu_id as number
      √ TC-4.2: should return name as non-empty string
      √ TC-4.3: should return price as positive number
      √ TC-4.4: should return options as array
      √ TC-5.1: should return options array with string elements
      √ TC-5.2: should handle empty options array
      √ TC-6.1: should handle server errors gracefully

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

### 개선 사항

기존 3개의 통합 테스트를 13개의 최소 단위 테스트로 세분화하여:
- 각 검증 항목을 독립적으로 테스트 가능
- 실패 시 정확한 원인 파악 용이
- 테스트 유지보수성 향상
- 코드 커버리지 향상

---

**작성자**: AI Assistant  
**검토자**: 사용자  
**승인일**: 2025-11-01  
**구현일**: 2025-11-01

