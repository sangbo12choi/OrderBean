# OrderBean 테스트 가이드

## 테스트 구조

```
tests/
├── unit/              # 단위 테스트
│   ├── models/        # 모델 테스트
│   └── controllers/   # 컨트롤러 테스트
└── integration/       # 통합 테스트
    └── api/           # API 엔드포인트 테스트
```

## 테스트 실행

### 모든 테스트 실행
```bash
npm test
```

### Watch 모드로 실행 (파일 변경 시 자동 재실행)
```bash
npm run test:watch
```

### 커버리지 리포트 생성
```bash
npm run test:coverage
```

## 테스트 범주

### 단위 테스트 (Unit Tests)

#### Models
- `Menu.test.js`: Menu 모델의 CRUD 작업 테스트
- `Order.test.js`: Order 모델의 조회 및 상태 변경 테스트

#### Controllers
- `menuController.test.js`: 메뉴 컨트롤러 로직 테스트

### 통합 테스트 (Integration Tests)

#### API 엔드포인트
- `menus.test.js`: 메뉴 조회 API 테스트
- `orders.test.js`: 주문 생성 및 조회 API 테스트
- `admin.test.js`: 관리자 API 테스트 (메뉴 관리, 주문 상태 변경)
- `health.test.js`: 헬스 체크 API 테스트

## 테스트 작성 가이드

### 단위 테스트 예시

```javascript
describe('Menu Model', () => {
  it('should return all menus', async () => {
    // 테스트 코드
  });
});
```

### 통합 테스트 예시

```javascript
describe('GET /api/menus', () => {
  it('should return list of menus', async () => {
    const response = await request(app)
      .get('/api/menus')
      .expect(200);
    
    expect(response.body).toHaveProperty('menus');
  });
});
```

## 테스트 커버리지 목표

- **단위 테스트**: 80% 이상
- **통합 테스트**: 주요 API 엔드포인트 100%

## 주의사항

1. **데이터베이스**: 통합 테스트는 더미 데이터 모드에서 실행됩니다.
2. **독립성**: 각 테스트는 독립적으로 실행되어야 합니다.
3. **정리**: 테스트 후 생성된 데이터는 정리되어야 합니다.

## 테스트 실행 전 준비사항

1. 의존성 설치: `npm install`
2. 환경 변수 설정 (선택사항): `.env` 파일 생성
   - 더미 데이터 모드가 기본값이므로 데이터베이스 설정은 선택사항입니다.

