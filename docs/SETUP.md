# OrderBean 설치 및 설정 가이드

## 사전 요구사항

- Node.js (버전 14 이상)
- MySQL (버전 5.7 이상) 또는 PostgreSQL
- npm 또는 yarn

## 설치 단계

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/OrderBean.git
cd OrderBean
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 데이터베이스 설정

#### MySQL 사용 시

1. MySQL에 접속하여 데이터베이스 생성:

```bash
mysql -u root -p
```

2. 스키마 파일 실행:

```bash
mysql -u root -p < database/schema.sql
```

3. 시드 데이터 삽입 (선택사항):

```bash
mysql -u root -p < database/seed.sql
```

#### PostgreSQL 사용 시

PostgreSQL을 사용하는 경우 `backend/config/database.js` 파일을 수정해야 합니다.

### 4. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=orderbean
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3000
NODE_ENV=development
```

### 5. 서버 실행

#### 개발 모드

```bash
npm run dev
```

개발 모드에서는 `nodemon`을 사용하여 파일 변경 시 자동으로 서버가 재시작됩니다.

#### 프로덕션 모드

```bash
npm start
```

### 6. 접속 확인

서버가 정상적으로 실행되면 다음 URL로 접속할 수 있습니다:

- 프론트엔드: `http://localhost:3000/frontend/html/index.html`
- API Health Check: `http://localhost:3000/api/health`

## 문제 해결

### 데이터베이스 연결 오류

1. MySQL 서비스가 실행 중인지 확인하세요.
2. `.env` 파일의 데이터베이스 정보가 올바른지 확인하세요.
3. 데이터베이스 사용자에게 필요한 권한이 있는지 확인하세요.

### 포트 충돌

다른 애플리케이션이 3000번 포트를 사용 중인 경우, `.env` 파일에서 `PORT` 값을 변경하세요.

### 모듈을 찾을 수 없음

`node_modules` 디렉토리를 삭제하고 다시 설치하세요:

```bash
rm -rf node_modules
npm install
```

## 다음 단계

설치가 완료되면 다음 문서를 참고하세요:

- [API 문서](./API.md)
- [README.md](../README.md)

