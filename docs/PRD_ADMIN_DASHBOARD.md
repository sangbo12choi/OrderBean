# OrderBean 관리자 대시보드 PRD

**작성일**: 2025-11-01  
**버전**: 1.0  
**상태**: 요구사항 정의

---

## 📋 목차

- [개요](#개요)
- [사용자 스토리](#사용자-스토리)
- [기능 요구사항](#기능-요구사항)
- [UI/UX 설계](#uiux-설계)
- [API 설계](#api-설계)
- [데이터베이스 설계](#데이터베이스-설계)
- [기술 스택](#기술-스택)
- [구현 우선순위](#구현-우선순위)

---

## 🎯 개요

### 목적

OrderBean 관리자 대시보드는 카페 운영자가 메뉴, 주문, 재고를 효율적으로 관리할 수 있도록 지원하는 웹 기반 관리 도구입니다.

### 목표 사용자

- 카페 매니저
- 카페 직원 (주문 처리 담당)
- 카페 운영자

### 핵심 가치

- ⚡ **실시간 모니터링**: 주문 현황 및 통계 실시간 확인
- 📊 **효율적 관리**: 메뉴, 주문, 재고를 한 화면에서 관리
- 🎯 **빠른 처리**: 주문 상태 변경 및 재고 조정을 빠르게 처리
- 📈 **데이터 기반 의사결정**: 통계 데이터를 통한 운영 최적화

---

## 👥 사용자 스토리

### US-ADM-001: 관리자 대시보드 조회

**As a** 카페 매니저  
**I want to** 대시보드에서 전체 주문 현황과 통계를 한눈에 확인하고 싶다  
**So that** 카페 운영 상태를 빠르게 파악할 수 있다

**Acceptance Criteria**:
- 총 주문 수, 주문 접수 수, 제조 중 수, 제조 완료 수를 표시
- 실시간으로 통계가 업데이트됨
- 각 통계 항목을 클릭하면 해당 상태의 주문 목록으로 이동

---

### US-ADM-002: 재고 현황 관리

**As a** 카페 매니저  
**I want to** 각 메뉴의 재고 수량을 확인하고 조정하고 싶다  
**So that** 메뉴 품절을 방지하고 재고를 효율적으로 관리할 수 있다

**Acceptance Criteria**:
- 메뉴별 현재 재고 수량 표시
- +/- 버튼으로 재고 수량 조정 가능
- 재고가 부족할 경우 경고 표시
- 재고 변경 이력 기록

---

### US-ADM-003: 주문 현황 관리

**As a** 카페 직원  
**I want to** 주문 목록을 확인하고 주문 상태를 변경하고 싶다  
**So that** 주문을 효율적으로 처리할 수 있다

**Acceptance Criteria**:
- 주문 목록을 날짜/시간 순으로 표시
- 각 주문의 메뉴, 수량, 가격 정보 표시
- 주문 상태 변경 버튼 (접수 → 제조중 → 완료)
- 주문 상태별 필터링 기능

---

### US-ADM-004: 메뉴 관리

**As a** 카페 매니저  
**I want to** 메뉴를 등록, 수정, 삭제하고 싶다  
**So that** 메뉴를 유연하게 관리할 수 있다

**Acceptance Criteria**:
- 메뉴 등록 폼 제공
- 메뉴 수정 기능
- 메뉴 삭제 기능 (확인 다이얼로그)
- 메뉴 활성화/비활성화 기능

---

## ✨ 기능 요구사항

### 1. 관리자 대시보드

#### 1.1 대시보드 통계

**기능 설명**: 전체 주문 현황을 한눈에 볼 수 있는 통계 카드

**요구사항**:
- 총 주문 수 표시
- 주문 접수 수 표시
- 제조 중 수 표시
- 제조 완료 수 표시
- 각 통계는 실시간으로 업데이트
- 통계 카드 클릭 시 해당 상태의 주문 목록으로 필터링

**데이터 표시 형식**:
```
총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0
```

**우선순위**: 높음

---

#### 1.2 실시간 업데이트

**기능 설명**: 주문 상태 변경 시 대시보드 통계 자동 업데이트

**요구사항**:
- WebSocket 또는 Polling을 통한 실시간 업데이트
- 업데이트 간격: 5초 (설정 가능)
- 사용자에게 업데이트 알림 표시 (선택사항)

**우선순위**: 중간

---

### 2. 재고 현황 관리

#### 2.1 재고 목록 표시

**기능 설명**: 메뉴별 재고 수량을 카드 형태로 표시

**요구사항**:
- 메뉴명 표시 (온도 포함: 예: "아메리카노(ICE)")
- 현재 재고 수량 표시 (예: "10개")
- 재고 부족 경고 (재고 < 5개 시 경고 표시)
- 재고 카드 레이아웃: 그리드 형태 (3열)

**UI 구성**:
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 아메리카노(ICE) │  │ 아메리카노(HOT) │  │   카페라떼      │
│     10개        │  │     10개        │  │     10개        │
│   [+]  [-]      │  │   [+]  [-]      │  │   [+]  [-]      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**우선순위**: 높음

---

#### 2.2 재고 수량 조정

**기능 설명**: +/- 버튼으로 재고 수량 증가/감소

**요구사항**:
- + 버튼 클릭 시 재고 1 증가
- - 버튼 클릭 시 재고 1 감소
- 재고가 0일 때 - 버튼 비활성화
- 재고 변경 시 즉시 서버에 반영
- 변경 확인 메시지 표시
- 재고 변경 이력 기록 (선택사항)

**우선순위**: 높음

---

#### 2.3 재고 초기화

**기능 설명**: 특정 메뉴의 재고를 초기값으로 리셋

**요구사항**:
- 초기 재고 값 설정 (기본값: 10)
- 재고 초기화 버튼 (선택사항)
- 초기화 확인 다이얼로그

**우선순위**: 낮음

---

### 3. 주문 현황 관리

#### 3.1 주문 목록 표시

**기능 설명**: 주문 목록을 시간순으로 표시

**요구사항**:
- 주문 날짜/시간 표시 (예: "7월 31일 13:00")
- 주문 메뉴 및 수량 표시 (예: "아메리카노(ICE) x 1")
- 주문 가격 표시 (예: "4,000원")
- 주문 상태 표시 (접수/제조중/완료)
- 주문 상태별 색상 구분
- 최신 주문이 상단에 표시

**UI 구성**:
```
┌─────────────────────────────────────────────┐
│ 7월 31일 13:00                              │
│ 아메리카노(ICE) x 1                         │
│ 4,000원                                     │
│ [주문 접수]                                 │
└─────────────────────────────────────────────┘
```

**우선순위**: 높음

---

#### 3.2 주문 상태 변경

**기능 설명**: 주문 상태를 변경 (접수 → 제조중 → 완료)

**요구사항**:
- "주문 접수" 버튼: 접수 상태로 변경
- "제조 시작" 버튼: 제조중 상태로 변경
- "제조 완료" 버튼: 완료 상태로 변경
- 상태 변경 시 대시보드 통계 자동 업데이트
- 상태 변경 확인 메시지 표시
- 상태 변경 이력 기록

**상태 전이**:
```
접수 → 제조중 → 완료
```

**우선순위**: 높음

---

#### 3.3 주문 필터링

**기능 설명**: 주문 상태별로 필터링

**요구사항**:
- 전체 주문 보기
- 접수 주문만 보기
- 제조중 주문만 보기
- 완료 주문만 보기
- 날짜별 필터링 (선택사항)

**우선순위**: 중간

---

#### 3.4 주문 상세 정보

**기능 설명**: 주문의 상세 정보 표시

**요구사항**:
- 주문 ID 표시
- 사용자 ID 표시
- 주문 시간 표시
- 주문 메뉴 목록 및 옵션 표시
- 총 주문 금액 표시
- 주문 상태 변경 이력 (선택사항)

**우선순위**: 중간

---

### 4. 메뉴 관리

#### 4.1 메뉴 등록

**기능 설명**: 새로운 메뉴 등록

**요구사항**:
- 메뉴명 입력
- 가격 입력
- 옵션 설정 (HOT/ICE, SIZE 등)
- 이미지 업로드 (선택사항)
- 초기 재고 설정 (선택사항)
- 등록 확인 메시지

**우선순위**: 높음

---

#### 4.2 메뉴 수정

**기능 설명**: 기존 메뉴 정보 수정

**요구사항**:
- 메뉴명 수정
- 가격 수정
- 옵션 수정
- 이미지 변경 (선택사항)
- 수정 확인 메시지

**우선순위**: 높음

---

#### 4.3 메뉴 삭제

**기능 설명**: 메뉴 삭제

**요구사항**:
- 삭제 확인 다이얼로그
- 삭제 확인 메시지
- 삭제된 메뉴는 주문 이력에 남음

**우선순위**: 높음

---

#### 4.4 메뉴 활성화/비활성화

**기능 설명**: 메뉴를 일시적으로 판매 중지

**요구사항**:
- 메뉴 활성화/비활성화 토글
- 비활성화된 메뉴는 고객 화면에 표시되지 않음
- 관리자 화면에서는 계속 표시됨

**우선순위**: 중간

---

## 🎨 UI/UX 설계

### 전체 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
│ OrderBean                    [주문하기] [관리자]        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 관리자 대시보드                                         │
│ 총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 재고 현황                                               │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│ │아메리카노│  │아메리카노│  │ 카페라떼 │             │
│ │  (ICE)   │  │  (HOT)   │  │          │             │
│ │   10개   │  │   10개   │  │   10개   │             │
│ │ [+] [-]  │  │ [+] [-]  │  │ [+] [-]  │             │
│ └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 주문 현황                                               │
│ ┌─────────────────────────────────────────────────┐   │
│ │ 7월 31일 13:00                                  │   │
│ │ 아메리카노(ICE) x 1                             │   │
│ │ 4,000원                                         │   │
│ │ [주문 접수]                                     │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 색상 스키마

- **주요 색상**: 
  - Primary: #4a90e2 (파란색)
  - Success: #27ae60 (초록색)
  - Warning: #f39c12 (주황색)
  - Danger: #e74c3c (빨간색)
  - Background: #f5f5f5 (회색)

- **상태별 색상**:
  - 접수: #f39c12 (주황색)
  - 제조중: #3498db (파란색)
  - 완료: #27ae60 (초록색)

---

### 컴포넌트 설계

#### 1. 통계 카드 컴포넌트

```jsx
<StatCard
  title="총 주문"
  value={totalOrders}
  color="#4a90e2"
  onClick={() => filterOrders('all')}
/>
```

#### 2. 재고 카드 컴포넌트

```jsx
<InventoryCard
  menuName="아메리카노(ICE)"
  stock={10}
  onIncrease={() => updateStock(menuId, 1)}
  onDecrease={() => updateStock(menuId, -1)}
/>
```

#### 3. 주문 카드 컴포넌트

```jsx
<OrderCard
  orderId={1}
  dateTime="7월 31일 13:00"
  items={[{ name: "아메리카노(ICE)", quantity: 1 }]}
  price={4000}
  status="접수"
  onStatusChange={(newStatus) => updateOrderStatus(orderId, newStatus)}
/>
```

---

## 🔌 API 설계

### 대시보드 통계 API

#### GET /api/admin/dashboard/stats

**설명**: 대시보드 통계 데이터 조회

**응답**:
```json
{
  "status": "success",
  "data": {
    "total_orders": 1,
    "pending_orders": 1,
    "processing_orders": 0,
    "completed_orders": 0
  }
}
```

**우선순위**: 높음

---

### 재고 관리 API

#### GET /api/admin/inventory

**설명**: 모든 메뉴의 재고 현황 조회

**응답**:
```json
{
  "status": "success",
  "data": {
    "inventory": [
      {
        "menu_id": 1,
        "menu_name": "아메리카노(ICE)",
        "stock": 10,
        "low_stock_warning": false
      },
      {
        "menu_id": 2,
        "menu_name": "아메리카노(HOT)",
        "stock": 10,
        "low_stock_warning": false
      }
    ]
  }
}
```

**우선순위**: 높음

---

#### PUT /api/admin/inventory/{menu_id}

**설명**: 특정 메뉴의 재고 수량 변경

**요청 본문**:
```json
{
  "stock": 11,
  "action": "increase" // "increase" | "decrease" | "set"
}
```

**응답**:
```json
{
  "status": "success",
  "data": {
    "menu_id": 1,
    "menu_name": "아메리카노(ICE)",
    "previous_stock": 10,
    "current_stock": 11
  }
}
```

**우선순위**: 높음

---

### 주문 현황 API

#### GET /api/admin/orders

**설명**: 관리자용 주문 목록 조회 (필터링 지원)

**쿼리 파라미터**:
- `status`: 주문 상태 필터 (접수/제조중/완료)
- `date`: 날짜 필터 (YYYY-MM-DD)
- `limit`: 페이지당 항목 수 (기본값: 50)
- `offset`: 페이지 오프셋 (기본값: 0)

**응답**:
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "order_id": 1,
        "user_id": 1,
        "status": "접수",
        "total_price": 4000,
        "created_at": "2025-07-31T13:00:00Z",
        "items": [
          {
            "menu_id": 1,
            "menu_name": "아메리카노(ICE)",
            "quantity": 1,
            "price": 4000,
            "options": {
              "temperature": "ICE"
            }
          }
        ]
      }
    ],
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

**우선순위**: 높음

---

#### PUT /api/admin/orders/{order_id}/status

**설명**: 주문 상태 변경

**요청 본문**:
```json
{
  "status": "제조중"
}
```

**응답**:
```json
{
  "status": "success",
  "data": {
    "order_id": 1,
    "previous_status": "접수",
    "current_status": "제조중",
    "updated_at": "2025-07-31T13:05:00Z"
  }
}
```

**우선순위**: 높음

---

## 🗄️ 데이터베이스 설계

### Inventory 테이블 (신규)

**목적**: 메뉴별 재고 관리

```sql
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    menu_id INTEGER NOT NULL REFERENCES menus(menu_id) ON DELETE CASCADE,
    stock INTEGER NOT NULL DEFAULT 10,
    low_stock_threshold INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(menu_id)
);

CREATE INDEX idx_inventory_menu_id ON inventory(menu_id);
CREATE INDEX idx_inventory_low_stock ON inventory(stock) WHERE stock < low_stock_threshold;
```

---

### Order Status History 테이블 (선택사항)

**목적**: 주문 상태 변경 이력 기록

```sql
CREATE TABLE order_status_history (
    history_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INTEGER REFERENCES users(user_id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_changed_at ON order_status_history(changed_at);
```

---

### Inventory History 테이블 (선택사항)

**목적**: 재고 변경 이력 기록

```sql
CREATE TABLE inventory_history (
    history_id SERIAL PRIMARY KEY,
    menu_id INTEGER NOT NULL REFERENCES menus(menu_id) ON DELETE CASCADE,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'increase', 'decrease', 'set'
    changed_by INTEGER REFERENCES users(user_id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_history_menu_id ON inventory_history(menu_id);
CREATE INDEX idx_inventory_history_changed_at ON inventory_history(changed_at);
```

---

## 🛠️ 기술 스택

### 프론트엔드

- **프레임워크**: React (또는 현재 HTML/JS)
- **상태 관리**: Context API 또는 Redux
- **HTTP 클라이언트**: Axios 또는 Fetch API
- **UI 라이브러리**: Material-UI 또는 Tailwind CSS (선택사항)

### 백엔드

- **현재**: Node.js + Express
- **향후**: Python + FastAPI (PRD_Up1.md 참고)

### 데이터베이스

- **현재**: MySQL
- **향후**: PostgreSQL (PRD_Up1.md 참고)

---

## 📊 구현 우선순위

### Phase 1: 핵심 기능 (필수)

1. ✅ 관리자 대시보드 통계 표시
2. ✅ 재고 현황 목록 표시
3. ✅ 재고 수량 조정 (+/- 버튼)
4. ✅ 주문 현황 목록 표시
5. ✅ 주문 상태 변경 기능

**예상 기간**: 2주

---

### Phase 2: 개선 기능 (중요)

1. 주문 필터링 기능
2. 실시간 업데이트 (Polling)
3. 재고 부족 경고
4. 주문 상세 정보 표시

**예상 기간**: 1주

---

### Phase 3: 고급 기능 (선택사항)

1. 재고 변경 이력 기록
2. 주문 상태 변경 이력 기록
3. 통계 차트 및 그래프
4. 메뉴 이미지 업로드
5. WebSocket 실시간 업데이트

**예상 기간**: 2주

---

## 📝 비기능 요구사항

### 성능

- 대시보드 로딩 시간: 2초 이내
- 재고 수량 조정 응답 시간: 1초 이내
- 주문 상태 변경 응답 시간: 1초 이내

### 보안

- 관리자 권한 검증
- API 인증 토큰 필수
- 입력 데이터 검증

### 사용성

- 반응형 디자인 (모바일 지원)
- 직관적인 UI/UX
- 에러 메시지 명확성

---

## 🔄 향후 확장 계획

1. **알림 시스템**: 재고 부족, 새 주문 알림
2. **리포트 기능**: 일별/월별 매출 리포트
3. **인기 메뉴 분석**: 주문 통계 기반 분석
4. **재고 자동 주문**: 재고 부족 시 자동 주문 알림
5. **다중 매장 지원**: 여러 매장 관리 기능

---

**문서 버전**: 1.0  
**최종 업데이트**: 2025-11-01  
**작성자**: OrderBean 개발팀

