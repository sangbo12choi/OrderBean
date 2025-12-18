# 인증 기능 설정 가이드

## 📋 목차
1. [데이터베이스 마이그레이션 실행](#데이터베이스-마이그레이션-실행)
2. [마이그레이션 상태 확인](#마이그레이션-상태-확인)
3. [서버 실행](#서버-실행)
4. [테스트](#테스트)

---

## 데이터베이스 마이그레이션 실행

### 방법 1: 명령줄에서 실행 (권장)

#### Windows (PowerShell 또는 CMD)
```bash
# MySQL이 PATH에 설정되어 있는 경우
mysql -u root -p orderbean < database/migration_add_auth_safe.sql

# 또는 전체 경로 사용
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p orderbean < database/migration_add_auth_safe.sql
```

#### Mac/Linux
```bash
mysql -u root -p orderbean < database/migration_add_auth_safe.sql
```

**실행 시:**
- 비밀번호를 입력하라는 프롬프트가 나타납니다
- MySQL root 비밀번호를 입력하세요

---

### 방법 2: MySQL 클라이언트에서 실행

1. **MySQL 클라이언트 접속**
   ```bash
   mysql -u root -p
   ```

2. **데이터베이스 선택**
   ```sql
   USE orderbean;
   ```

3. **마이그레이션 파일 실행**
   ```sql
   source database/migration_add_auth_safe.sql;
   ```
   
   또는 절대 경로 사용:
   ```sql
   source C:/DEV/Cursor_pro/OrderBeen/database/migration_add_auth_safe.sql;
   ```

4. **확인**
   ```sql
   DESCRIBE users;
   ```
   
   결과에 `email`과 `password` 컬럼이 보이면 성공입니다.

---

### 방법 3: MySQL Workbench 사용

1. MySQL Workbench 실행
2. 데이터베이스 연결
3. `File` → `Open SQL Script`
4. `database/migration_add_auth_safe.sql` 파일 선택
5. `USE orderbean;` 추가 (파일 맨 위에)
6. 실행 버튼 클릭 (⚡)

---

## 마이그레이션 상태 확인

### 스크립트로 확인 (권장)

```bash
node database/check_migration.js
```

**예상 출력:**
```
✅ 데이터베이스 연결 성공

📋 users 테이블 컬럼 목록:
  - user_id (int) NOT NULL [PRI]
  - role (enum) NOT NULL []
  - created_at (timestamp) NULL []
  - updated_at (timestamp) NULL []
  - email (varchar) NULL [UNI]
  - password (varchar) NULL []

🔍 마이그레이션 상태:
✅ email 컬럼: 존재함
✅ password 컬럼: 존재함

✅ 마이그레이션이 완료되었습니다!
```

### MySQL에서 직접 확인

```sql
USE orderbean;
DESCRIBE users;
```

또는

```sql
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'orderbean' AND TABLE_NAME = 'users';
```

---

## 서버 실행

### 1. 환경 변수 확인 (선택사항)

`.env` 파일이 있다면 확인:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=orderbean
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-change-in-production
```

### 2. 서버 시작

```bash
npm start
```

또는 개발 모드 (nodemon):
```bash
npm run dev
```

**예상 출력:**
```
✅ Database connected successfully
OrderBean server is running on http://localhost:3000
```

---

## 테스트

### 1. 회원가입 테스트

1. 브라우저에서 `http://localhost:3000/register` 접속
2. 이메일과 비밀번호 입력
3. 회원가입 버튼 클릭

**성공 시:**
- "회원가입이 완료되었습니다" 메시지 표시
- 자동으로 홈 페이지로 이동
- 헤더에 이메일 주소와 로그아웃 버튼 표시

### 2. 로그인 테스트

1. 브라우저에서 `http://localhost:3000/login` 접속
2. 회원가입한 이메일과 비밀번호 입력
3. 로그인 버튼 클릭

**성공 시:**
- "로그인되었습니다" 메시지 표시
- 자동으로 홈 페이지로 이동

### 3. 주문 테스트

1. 로그인 상태에서 메뉴 선택
2. 장바구니에 추가
3. 주문하기 버튼 클릭

**성공 시:**
- 주문이 생성되고 장바구니가 비워짐

---

## 문제 해결

### 오류: "Unknown column 'email' in 'field list'"

**원인:** 마이그레이션이 실행되지 않음

**해결:**
```bash
# 마이그레이션 상태 확인
node database/check_migration.js

# 마이그레이션 실행
mysql -u root -p orderbean < database/migration_add_auth_safe.sql
```

---

### 오류: "Access denied for user"

**원인:** MySQL 사용자 권한 문제

**해결:**
1. MySQL root 비밀번호 확인
2. `.env` 파일의 `DB_USER`와 `DB_PASSWORD` 확인
3. 사용자에게 권한 부여:
   ```sql
   GRANT ALL PRIVILEGES ON orderbean.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### 오류: "Database 'orderbean' doesn't exist"

**원인:** 데이터베이스가 생성되지 않음

**해결:**
```bash
# schema.sql 실행
mysql -u root -p < database/schema.sql

# 그 다음 마이그레이션 실행
mysql -u root -p orderbean < database/migration_add_auth_safe.sql
```

---

### 오류: "ER_DUP_ENTRY: Duplicate entry"

**원인:** 이미 마이그레이션이 실행됨

**해결:**
- `migration_add_auth_safe.sql` 사용 (중복 실행 가능)
- 또는 무시해도 됨 (이미 컬럼이 존재함)

---

## 빠른 시작 체크리스트

- [ ] MySQL 서버 실행 중인지 확인
- [ ] 데이터베이스 `orderbean` 존재 확인
- [ ] 마이그레이션 실행: `mysql -u root -p orderbean < database/migration_add_auth_safe.sql`
- [ ] 마이그레이션 확인: `node database/check_migration.js`
- [ ] 서버 시작: `npm start`
- [ ] 브라우저에서 `http://localhost:3000/register` 접속
- [ ] 회원가입 테스트

---

## 추가 정보

### API 엔드포인트

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보 (인증 필요)

### 파일 위치

- 마이그레이션 파일: `database/migration_add_auth_safe.sql`
- 확인 스크립트: `database/check_migration.js`
- 인증 컨트롤러: `backend/controllers/authController.js`
- 인증 미들웨어: `backend/middleware/auth.js`

