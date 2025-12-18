-- OrderBean 인증 기능 추가 마이그레이션
-- Users 테이블에 email, password 필드 추가

USE orderbean;

-- email 컬럼 추가 (이미 존재하면 오류 발생, 수동으로 확인 필요)
ALTER TABLE users 
ADD COLUMN email VARCHAR(255) UNIQUE;

-- password 컬럼 추가 (이미 존재하면 오류 발생, 수동으로 확인 필요)
ALTER TABLE users 
ADD COLUMN password VARCHAR(255);

-- email에 인덱스 추가 (이미 존재하면 오류 발생)
CREATE INDEX idx_users_email ON users(email);

-- 기존 users 테이블이 비어있거나 테스트 데이터만 있는 경우, 컬럼을 NOT NULL로 변경
-- 주의: 실제 데이터가 있는 경우 이 쿼리는 실패할 수 있으므로 주의해서 실행
-- ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NOT NULL;
-- ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;

