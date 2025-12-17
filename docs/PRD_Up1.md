# OrderBean v2.0 - Product Requirements Document (PRD)

> Python + FastAPI + React + Render 기반 간편 커피 주문 웹서비스

**작성일**: 2025-11-01  
**버전**: 2.0  
**상태**: 업데이트

---

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [주요 기능](#주요-기능)
- [API 설계](#api-설계)
- [데이터베이스 설계](#데이터베이스-설계)
- [프로젝트 구조](#프로젝트-구조)
- [개발 환경 설정](#개발-환경-설정)
- [배포 전략](#배포-전략)
- [테스트 전략](#테스트-전략)
- [성공 지표](#성공-지표)

---

## 🎯 프로젝트 개요

**OrderBean**은 카페 대기 시간과 반복적인 커스터마이징 주문 문제를 해결하기 위한 간편 커피 주문 웹서비스입니다.

### 핵심 가치

- ⚡ **속도**: 빠른 주문 및 픽업 (주문 생성 시간 10초 이내)
- 🎯 **편의성**: 반복 주문 최소화
- 📈 **운영 효율**: 주문 흐름 단순화
- 🔒 **보안**: JWT 기반 인증 및 OAuth2 지원

### 배경 및 필요성

- 출퇴근 시간대 카페 대기 시간 증가
- 커피 커스터마이징 주문 증가로 인한 주문 오류
- 단골 고객 관리의 비효율성
- 모던 웹 기술 스택을 활용한 확장 가능한 아키텍처 필요

---

## 🛠️ 기술 스택

### 기술 스택 상세

| 계층 | 사용 기술 | 설명 |
|------|----------|------|
| **프론트엔드 (UI)** | React | 빠른 프로토타입 또는 완성형 웹 인터페이스 |
| **백엔드 (API)** | FastAPI | 비동기 고성능 Python 웹 프레임워크 |
| **데이터베이스** | PostgreSQL | 안정적이고 ORM 기반의 DB 설계 |
| **인증/세션** | FastAPI Users, OAuth2 | 로그인, JWT 인증 |
| **테스트** | pytest | 단위/통합 테스트 |
| **문서화** | Swagger / ReDoc | FastAPI 자동 문서 생성 |
| **배포/환경** | Render | 백엔드, DB, 프론트 통합 실행 환경 구성 |

### 기술 선택 이유

#### 프론트엔드: React
- **컴포넌트 기반 아키텍처**: 재사용 가능한 UI 컴포넌트
- **상태 관리**: 복잡한 장바구니 및 주문 상태 관리
- **빠른 개발**: 풍부한 생태계와 라이브러리
- **성능**: Virtual DOM을 통한 효율적인 렌더링

#### 백엔드: FastAPI
- **고성능**: Starlette와 Pydantic 기반의 비동기 처리
- **자동 문서화**: Swagger/ReDoc 자동 생성
- **타입 안정성**: Python 타입 힌트와 Pydantic 검증
- **현대적**: Python 3.7+ 최신 기능 활용

#### 데이터베이스: PostgreSQL
- **안정성**: 엔터프라이즈급 관계형 데이터베이스
- **ORM 지원**: SQLAlchemy와 완벽한 통합
- **JSON 지원**: 옵션 데이터 저장에 유리
- **확장성**: 복잡한 쿼리 및 트랜잭션 처리

#### 인증: FastAPI Users + OAuth2
- **표준 준수**: OAuth2 표준 인증 프로토콜
- **JWT 토큰**: 상태 없는 인증 메커니즘
- **보안**: 비밀번호 해싱, 토큰 갱신 등 내장 기능
- **확장성**: 소셜 로그인 추가 용이

#### 배포: Render
- **통합 환경**: 백엔드, 프론트엔드, 데이터베이스 통합 관리
- **자동 배포**: Git 연동 자동 배포
- **확장성**: 트래픽에 따른 자동 스케일링
- **비용 효율**: 사용량 기반 과금

---

## 🏗️ 시스템 아키텍처

### 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    사용자 (브라우저)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Render)                    │
│  - React Components                                     │
│  - React Router                                         │
│  - State Management (Context/Redux)                     │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│            FastAPI Backend (Render)                     │
│  ┌──────────────────────────────────────────────┐     │
│  │  API Routes                                   │     │
│  │  - /api/menus                                 │     │
│  │  - /api/orders                                │     │
│  │  - /api/admin/*                               │     │
│  │  - /api/auth/*                                │     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │  Business Logic                               │     │
│  │  - Controllers                                │     │
│  │  - Services                                   │     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │  Data Access Layer                            │     │
│  │  - SQLAlchemy ORM                             │     │
│  │  - Models                                     │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     │ SQL
                     ▼
┌─────────────────────────────────────────────────────────┐
│         PostgreSQL Database (Render)                   │
│  - Users                                                │
│  - Menus                                                │
│  - Orders                                               │
│  - OrderItems                                           │
└─────────────────────────────────────────────────────────┘
```

### 데이터 흐름

1. **사용자 요청**: React 프론트엔드에서 API 호출
2. **인증 확인**: JWT 토큰 검증 (필요 시)
3. **요청 처리**: FastAPI 라우터에서 요청 수신
4. **비즈니스 로직**: Controller/Service에서 처리
5. **데이터 접근**: SQLAlchemy ORM을 통한 DB 쿼리
6. **응답 반환**: JSON 형식으로 응답
7. **UI 업데이트**: React 컴포넌트 상태 업데이트

---

## ✨ 주요 기능

### 고객 기능

#### 1. 메뉴 조회
- **기능**: 커피 메뉴 목록 조회
- **요구사항**:
  - 메뉴명, 가격, 옵션 정보 표시
  - 이미지 표시 (선택사항)
  - 실시간 가격 업데이트
- **API**: `GET /api/menus`

#### 2. 주문 생성
- **기능**: 옵션 선택 후 주문 생성
- **요구사항**:
  - 온도 선택 (HOT/ICE)
  - 사이즈 선택 (S/M/L)
  - 추가 옵션 선택 (샷 추가, 시럽 추가 등)
  - 장바구니 기능
  - 주문 생성 시간 10초 이내
- **API**: `POST /api/orders`

#### 3. 주문 내역 조회
- **기능**: 사용자별 주문 내역 조회
- **요구사항**:
  - 주문 상태 확인 (접수/제조중/완료)
  - 주문 상세 정보 표시
  - 날짜별 필터링
- **API**: `GET /api/orders?user_id={user_id}`

#### 4. 사용자 인증
- **기능**: 회원가입, 로그인, 로그아웃
- **요구사항**:
  - 이메일/비밀번호 기반 인증
  - JWT 토큰 발급
  - 토큰 갱신
  - 소셜 로그인 (선택사항)
- **API**: `POST /api/auth/register`, `POST /api/auth/login`

### 관리자 기능

#### 1. 메뉴 관리 (CRUD)
- **기능**: 메뉴 등록, 수정, 삭제, 조회
- **요구사항**:
  - 메뉴명, 가격, 옵션 설정
  - 이미지 업로드 (선택사항)
  - 메뉴 활성화/비활성화
- **API**: `POST /api/admin/menus`, `PUT /api/admin/menus/{id}`, `DELETE /api/admin/menus/{id}`

#### 2. 주문 상태 관리
- **기능**: 주문 상태 변경
- **요구사항**:
  - 주문 상태 업데이트 (접수 → 제조중 → 완료)
  - 주문 취소 처리
  - 주문 히스토리 조회
- **API**: `PUT /api/admin/orders/{id}/status`

#### 3. 통계 및 리포트
- **기능**: 주문 통계 조회
- **요구사항**:
  - 일별/월별 매출 통계
  - 인기 메뉴 분석
  - 주문 추이 분석
- **API**: `GET /api/admin/stats` (선택사항)

---

## 🔌 API 설계

### API 기본 정보

- **Base URL**: `https://orderbean-api.onrender.com/api` (프로덕션)
- **Content-Type**: `application/json`
- **인증 방식**: Bearer Token (JWT)

### API 엔드포인트

#### 인증 API

```
POST   /api/auth/register          # 회원가입
POST   /api/auth/login             # 로그인
POST   /api/auth/logout            # 로그아웃
POST   /api/auth/refresh           # 토큰 갱신
GET    /api/auth/me                # 현재 사용자 정보
```

#### 메뉴 API

```
GET    /api/menus                  # 메뉴 목록 조회
GET    /api/menus/{id}             # 메뉴 상세 조회
```

#### 주문 API

```
POST   /api/orders                 # 주문 생성
GET    /api/orders                 # 주문 목록 조회
GET    /api/orders/{id}            # 주문 상세 조회
```

#### 관리자 API

```
POST   /api/admin/menus            # 메뉴 등록
PUT    /api/admin/menus/{id}       # 메뉴 수정
DELETE /api/admin/menus/{id}       # 메뉴 삭제
PUT    /api/admin/orders/{id}/status  # 주문 상태 변경
GET    /api/admin/orders           # 전체 주문 조회
GET    /api/admin/stats            # 통계 조회 (선택사항)
```

#### 헬스 체크

```
GET    /api/health                 # 서버 상태 확인
```

### API 응답 형식

#### 성공 응답

```json
{
  "status": "success",
  "data": {
    // 응답 데이터
  }
}
```

#### 에러 응답

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {}
  }
}
```

### 인증 예시

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "customer"
    }
  }
}
```

---

## 🗄️ 데이터베이스 설계

### ERD (Entity Relationship Diagram)

```
┌─────────────┐         ┌─────────────┐
│    Users    │         │    Menus    │
├─────────────┤         ├─────────────┤
│ user_id (PK)│         │ menu_id (PK)│
│ email       │         │ name        │
│ password    │         │ price       │
│ role        │         │ options     │
│ created_at  │         │ image_url   │
└──────┬──────┘         │ is_active   │
       │                │ created_at  │
       │                └──────┬──────┘
       │                       │
       │                ┌──────▼──────┐
       │                │ OrderItems  │
       │                ├─────────────┤
       │                │item_id (PK) │
       │                │order_id (FK)│
       │                │menu_id (FK) │
       │                │options      │
       │                │quantity     │
       │                └──────┬──────┘
       │                       │
       │                ┌──────▼──────┐
       │                │   Orders   │
       │                ├─────────────┤
       └───────────────►│order_id(PK)│
                        │user_id (FK)│
                        │status      │
                        │total_price │
                        │created_at  │
                        └────────────┘
```

### 테이블 스키마

#### Users 테이블

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Menus 테이블

```sql
CREATE TABLE menus (
    menu_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    options JSONB DEFAULT '[]',
    image_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menus_is_active ON menus(is_active);
```

#### Orders 테이블

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT '접수',
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

#### OrderItems 테이블

```sql
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    menu_id INTEGER NOT NULL REFERENCES menus(menu_id) ON DELETE RESTRICT,
    options JSONB DEFAULT '{}',
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
```

### SQLAlchemy 모델 예시

```python
from sqlalchemy import Column, Integer, String, Decimal, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="customer")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    orders = relationship("Order", back_populates="user")

class Menu(Base):
    __tablename__ = "menus"
    
    menu_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Decimal(10, 2), nullable=False)
    options = Column(JSON, default=list)
    image_url = Column(String(500))
    description = Column(String(1000))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"
    
    order_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    status = Column(String(50), nullable=False, default="접수")
    total_price = Column(Decimal(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    menu_id = Column(Integer, ForeignKey("menus.menu_id"), nullable=False)
    options = Column(JSON, default=dict)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Decimal(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="items")
    menu = relationship("Menu")
```

---

## 📁 프로젝트 구조

### 전체 프로젝트 구조

```
OrderBean/
├── backend/                      # FastAPI 백엔드
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI 앱 진입점
│   │   ├── config.py            # 설정 관리
│   │   ├── database.py          # 데이터베이스 연결
│   │   ├── dependencies.py      # 의존성 주입
│   │   │
│   │   ├── api/                 # API 라우터
│   │   │   ├── __init__.py
│   │   │   ├── deps.py          # 공통 의존성
│   │   │   ├── auth.py          # 인증 라우터
│   │   │   ├── menus.py         # 메뉴 라우터
│   │   │   ├── orders.py        # 주문 라우터
│   │   │   └── admin.py          # 관리자 라우터
│   │   │
│   │   ├── core/                 # 핵심 설정
│   │   │   ├── __init__.py
│   │   │   ├── config.py        # 환경 변수 설정
│   │   │   ├── security.py      # 보안 관련 (JWT, 해싱)
│   │   │   └── database.py      # DB 설정
│   │   │
│   │   ├── models/               # SQLAlchemy 모델
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── menu.py
│   │   │   ├── order.py
│   │   │   └── order_item.py
│   │   │
│   │   ├── schemas/              # Pydantic 스키마
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── menu.py
│   │   │   ├── order.py
│   │   │   └── auth.py
│   │   │
│   │   ├── services/             # 비즈니스 로직
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── menu_service.py
│   │   │   └── order_service.py
│   │   │
│   │   └── crud/                 # CRUD 작업
│   │       ├── __init__.py
│   │       ├── user.py
│   │       ├── menu.py
│   │       └── order.py
│   │
│   ├── tests/                    # 테스트
│   │   ├── __init__.py
│   │   ├── conftest.py          # pytest 설정
│   │   ├── test_auth.py
│   │   ├── test_menus.py
│   │   ├── test_orders.py
│   │   └── test_admin.py
│   │
│   ├── alembic/                  # 데이터베이스 마이그레이션
│   │   ├── versions/
│   │   └── env.py
│   │
│   ├── requirements.txt          # Python 의존성
│   ├── requirements-dev.txt      # 개발 의존성
│   ├── .env.example             # 환경 변수 예시
│   └── Dockerfile               # Docker 설정 (선택사항)
│
├── frontend/                     # React 프론트엔드
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/          # React 컴포넌트
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Cart.jsx
│   │   │   ├── menu/
│   │   │   │   ├── MenuList.jsx
│   │   │   │   └── MenuCard.jsx
│   │   │   ├── order/
│   │   │   │   ├── OrderForm.jsx
│   │   │   │   └── OrderHistory.jsx
│   │   │   └── admin/
│   │   │       ├── MenuManagement.jsx
│   │   │       └── OrderManagement.jsx
│   │   │
│   │   ├── pages/               # 페이지 컴포넌트
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Admin.jsx
│   │   │
│   │   ├── services/            # API 서비스
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── menu.js
│   │   │   └── order.js
│   │   │
│   │   ├── context/             # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── hooks/               # Custom Hooks
│   │   │   ├── useAuth.js
│   │   │   └── useCart.js
│   │   │
│   │   ├── utils/               # 유틸리티
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   │
│   │   ├── App.jsx              # 메인 앱 컴포넌트
│   │   ├── index.jsx            # 진입점
│   │   └── routes.jsx           # 라우팅 설정
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── README.md
│
├── docs/                         # 문서
│   ├── PRD_Up1.md              # 이 문서
│   ├── API.md                   # API 상세 문서
│   ├── SETUP.md                 # 설치 가이드
│   └── DEPLOYMENT.md            # 배포 가이드
│
├── .gitignore
├── README.md                    # 프로젝트 README
└── docker-compose.yml           # 로컬 개발 환경 (선택사항)
```

---

## ⚙️ 개발 환경 설정

### 사전 요구사항

- **Python**: 3.9 이상
- **Node.js**: 18 이상
- **PostgreSQL**: 14 이상 (로컬 개발용)
- **Git**: 최신 버전

### 백엔드 설정

#### 1. 가상 환경 생성 및 활성화

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2. 의존성 설치

```bash
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

#### 3. 환경 변수 설정

`backend/.env` 파일 생성:

```env
# 데이터베이스
DATABASE_URL=postgresql://user:password@localhost:5432/orderbean
DB_HOST=localhost
DB_PORT=5432
DB_NAME=orderbean
DB_USER=your_username
DB_PASSWORD=your_password

# FastAPI 설정
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS 설정
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# 환경
ENVIRONMENT=development
DEBUG=True
```

#### 4. 데이터베이스 마이그레이션

```bash
# Alembic 초기화 (최초 1회)
alembic init alembic

# 마이그레이션 생성
alembic revision --autogenerate -m "Initial migration"

# 마이그레이션 실행
alembic upgrade head
```

#### 5. 개발 서버 실행

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 프론트엔드 설정

#### 1. 의존성 설치

```bash
cd frontend
npm install
```

#### 2. 환경 변수 설정

`frontend/.env` 파일 생성:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

#### 3. 개발 서버 실행

```bash
npm start
```

### 테스트 실행

#### 백엔드 테스트

```bash
cd backend
pytest
pytest --cov=app tests/          # 커버리지 포함
pytest -v                        # 상세 출력
```

#### 프론트엔드 테스트

```bash
cd frontend
npm test
npm run test:coverage
```

---

## 🚀 배포 전략

### Render 배포

#### 1. PostgreSQL 데이터베이스 생성

1. Render 대시보드에서 "New +" → "PostgreSQL" 선택
2. 데이터베이스 이름: `orderbean-db`
3. 지역 선택 (가장 가까운 지역)
4. 생성 후 내부 데이터베이스 URL 복사

#### 2. 백엔드 배포

1. Render 대시보드에서 "New +" → "Web Service" 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `orderbean-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

4. 환경 변수 설정:
   ```
   DATABASE_URL=<Render PostgreSQL 내부 URL>
   SECRET_KEY=<랜덤 시크릿 키>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=https://orderbean.onrender.com
   ENVIRONMENT=production
   DEBUG=False
   ```

5. 배포 완료 후 URL 확인: `https://orderbean-api.onrender.com`

#### 3. 프론트엔드 배포

1. Render 대시보드에서 "New +" → "Static Site" 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `orderbean`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

4. 환경 변수 설정:
   ```
   REACT_APP_API_URL=https://orderbean-api.onrender.com/api
   REACT_APP_ENV=production
   ```

5. 배포 완료 후 URL 확인: `https://orderbean.onrender.com`

### CI/CD 파이프라인

Render는 Git 푸시 시 자동으로 배포를 트리거합니다:

1. **개발 브랜치 푸시** → 자동 배포 (Preview 환경)
2. **메인 브랜치 푸시** → 프로덕션 배포

### 배포 체크리스트

- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 실행
- [ ] CORS 설정 확인
- [ ] API 문서 접근 가능 (`/docs`, `/redoc`)
- [ ] 헬스 체크 엔드포인트 동작 확인
- [ ] 프론트엔드 API URL 설정 확인

---

## 🧪 테스트 전략

### 테스트 구조

```
tests/
├── conftest.py              # pytest 설정 및 fixtures
├── unit/                    # 단위 테스트
│   ├── test_models.py
│   ├── test_services.py
│   └── test_crud.py
├── integration/             # 통합 테스트
│   ├── test_auth_api.py
│   ├── test_menus_api.py
│   ├── test_orders_api.py
│   └── test_admin_api.py
└── e2e/                     # E2E 테스트 (선택사항)
    └── test_user_flow.py
```

### 테스트 예시

#### 단위 테스트 (pytest)

```python
# tests/unit/test_services.py
import pytest
from app.services.menu_service import MenuService
from app.models.menu import Menu

def test_get_all_menus(db_session):
    """모든 메뉴 조회 테스트"""
    # Given
    menu = Menu(name="아메리카노", price=4000, options=["HOT", "ICE"])
    db_session.add(menu)
    db_session.commit()
    
    # When
    service = MenuService(db_session)
    menus = service.get_all_menus()
    
    # Then
    assert len(menus) == 1
    assert menus[0].name == "아메리카노"
```

#### 통합 테스트 (FastAPI TestClient)

```python
# tests/integration/test_menus_api.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_menus():
    """메뉴 목록 조회 API 테스트"""
    response = client.get("/api/menus")
    assert response.status_code == 200
    assert "menus" in response.json()
    assert isinstance(response.json()["menus"], list)
```

### 테스트 커버리지 목표

- **단위 테스트**: 80% 이상
- **통합 테스트**: 주요 API 엔드포인트 100%
- **E2E 테스트**: 핵심 사용자 플로우

### 테스트 실행

```bash
# 모든 테스트 실행
pytest

# 커버리지 포함
pytest --cov=app --cov-report=html

# 특정 테스트만 실행
pytest tests/integration/test_menus_api.py

# Watch 모드 (개발 중)
pytest-watch
```

---

## 📊 성공 지표

### 성능 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 평균 주문 생성 시간 | 10초 이내 | API 응답 시간 측정 |
| 메뉴 조회 응답 시간 | 2초 이내 | API 응답 시간 측정 |
| 주문 생성 응답 시간 | 3초 이내 | API 응답 시간 측정 |
| API 가용성 | 99.9% 이상 | 모니터링 도구 |

### 기능 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 주문 처리 성공률 | 99% 이상 | 에러 로그 분석 |
| 사용자 만족도 | 4.5/5.0 이상 | 사용자 피드백 |
| 관리자 작업 효율 | 50% 향상 | 작업 시간 측정 |

### 기술 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 코드 커버리지 | 80% 이상 | pytest-cov |
| API 문서화 | 100% | Swagger 자동 생성 |
| 보안 취약점 | 0개 | 정적 분석 도구 |

---

## 📝 추가 고려사항

### 보안

- **비밀번호 해싱**: bcrypt 사용
- **JWT 토큰**: 짧은 만료 시간 + 리프레시 토큰
- **CORS**: 프로덕션 환경에서 엄격한 설정
- **SQL Injection 방지**: SQLAlchemy ORM 사용
- **XSS 방지**: React의 자동 이스케이프 활용
- **HTTPS**: 모든 통신 암호화

### 확장성

- **데이터베이스 인덱싱**: 자주 조회되는 컬럼에 인덱스 추가
- **캐싱**: Redis를 활용한 메뉴 캐싱 (선택사항)
- **로드 밸런싱**: Render의 자동 스케일링 활용
- **비동기 처리**: FastAPI의 비동기 기능 활용

### 모니터링

- **로깅**: 구조화된 로깅 (JSON 형식)
- **에러 추적**: Sentry 통합 (선택사항)
- **성능 모니터링**: APM 도구 활용 (선택사항)
- **헬스 체크**: 정기적인 헬스 체크 엔드포인트

### 문서화

- **API 문서**: Swagger/ReDoc 자동 생성
- **코드 문서**: docstring 작성
- **README**: 프로젝트 설정 및 실행 가이드
- **배포 문서**: 배포 프로세스 문서화

---

## 🔄 마이그레이션 계획

### 기존 시스템에서 마이그레이션

현재 Node.js/Express 기반 시스템에서 Python/FastAPI로 마이그레이션하는 경우:

1. **Phase 1: 백엔드 마이그레이션**
   - FastAPI 백엔드 구축
   - 데이터베이스 마이그레이션 (MySQL → PostgreSQL)
   - API 엔드포인트 구현
   - 테스트 작성

2. **Phase 2: 프론트엔드 마이그레이션**
   - React로 프론트엔드 재구성
   - API 연동
   - 상태 관리 구현
   - UI/UX 개선

3. **Phase 3: 배포 및 최적화**
   - Render에 배포
   - 성능 최적화
   - 모니터링 설정
   - 문서화 완료

---

## 📚 참고 자료

### 공식 문서

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [React 공식 문서](https://react.dev/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [SQLAlchemy 공식 문서](https://docs.sqlalchemy.org/)
- [Render 공식 문서](https://render.com/docs)

### 유용한 라이브러리

- **FastAPI Users**: 사용자 인증 및 관리
- **Pydantic**: 데이터 검증
- **Alembic**: 데이터베이스 마이그레이션
- **pytest**: 테스트 프레임워크
- **React Router**: 라우팅
- **Axios**: HTTP 클라이언트

---

**문서 버전**: 2.0  
**최종 업데이트**: 2025-11-01  
**작성자**: OrderBean 개발팀

