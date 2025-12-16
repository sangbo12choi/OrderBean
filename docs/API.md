# OrderBean API 문서

## 기본 정보

- Base URL: `http://localhost:3000/api`
- Content-Type: `application/json`

## 고객 API

### 1. 메뉴 조회

메뉴 목록을 조회합니다.

**요청**
```
GET /menus
```

**응답**
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

**상태 코드**
- `200 OK`: 성공

---

### 2. 주문 생성

새로운 주문을 생성합니다.

**요청**
```
POST /orders
```

**요청 본문**
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

**응답**
```json
{
  "order_id": 1,
  "status": "접수",
  "created_at": "2025-11-01T09:00:00.000Z"
}
```

**상태 코드**
- `201 Created`: 주문 생성 성공
- `400 Bad Request`: 필수 필드 누락

---

### 3. 주문 내역 조회

사용자의 주문 내역을 조회합니다.

**요청**
```
GET /orders?user_id={user_id}
```

**쿼리 파라미터**
- `user_id` (선택): 사용자 ID. 없으면 모든 주문 조회

**응답**
```json
{
  "orders": [
    {
      "order_id": 1,
      "user_id": 1,
      "status": "접수",
      "created_at": "2025-11-01T09:00:00.000Z",
      "items": [
        {
          "order_item_id": 1,
          "menu_id": 1,
          "options": {
            "temperature": "HOT",
            "size": "SIZE_M"
          }
        }
      ]
    }
  ]
}
```

**상태 코드**
- `200 OK`: 성공

---

## 관리자 API

### 1. 메뉴 등록

새로운 메뉴를 등록합니다.

**요청**
```
POST /admin/menus
```

**요청 본문**
```json
{
  "name": "아메리카노",
  "price": 4000,
  "options": ["HOT", "ICE", "SIZE_S", "SIZE_M", "SIZE_L"]
}
```

**응답**
```json
{
  "menu_id": 1,
  "message": "메뉴가 등록되었습니다."
}
```

**상태 코드**
- `201 Created`: 메뉴 등록 성공
- `400 Bad Request`: 필수 필드 누락

---

### 2. 메뉴 수정

기존 메뉴를 수정합니다.

**요청**
```
PUT /admin/menus/{id}
```

**요청 본문**
```json
{
  "name": "아메리카노",
  "price": 4500,
  "options": ["HOT", "ICE", "SIZE_S", "SIZE_M", "SIZE_L"]
}
```

**응답**
```json
{
  "menu_id": 1,
  "message": "메뉴가 수정되었습니다."
}
```

**상태 코드**
- `200 OK`: 메뉴 수정 성공

---

### 3. 메뉴 삭제

메뉴를 삭제합니다.

**요청**
```
DELETE /admin/menus/{id}
```

**응답**
```json
{
  "menu_id": 1,
  "message": "메뉴가 삭제되었습니다."
}
```

**상태 코드**
- `200 OK`: 메뉴 삭제 성공

---

### 4. 주문 상태 변경

주문 상태를 변경합니다.

**요청**
```
PUT /admin/orders/{id}/status
```

**요청 본문**
```json
{
  "status": "제조중"
}
```

**유효한 상태 값**
- `접수`
- `제조중`
- `완료`

**응답**
```json
{
  "order_id": 1,
  "status": "제조중",
  "message": "주문 상태가 변경되었습니다."
}
```

**상태 코드**
- `200 OK`: 상태 변경 성공
- `400 Bad Request`: 유효하지 않은 상태 값

---

## 에러 응답

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "error": "에러 메시지",
  "message": "상세 에러 메시지"
}
```

**상태 코드**
- `400 Bad Request`: 잘못된 요청
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

