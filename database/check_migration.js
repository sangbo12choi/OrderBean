// 데이터베이스 마이그레이션 확인 스크립트
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMigration() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'orderbean',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ 데이터베이스 연결 성공\n');

    // users 테이블 구조 확인
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME || 'orderbean']
    );

    console.log('📋 users 테이블 컬럼 목록:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'} ${col.COLUMN_KEY ? `[${col.COLUMN_KEY}]` : ''}`);
    });

    const columnNames = columns.map(col => col.COLUMN_NAME);
    const hasEmail = columnNames.includes('email');
    const hasPassword = columnNames.includes('password');

    console.log('\n🔍 마이그레이션 상태:');
    if (hasEmail && hasPassword) {
      console.log('✅ email 컬럼: 존재함');
      console.log('✅ password 컬럼: 존재함');
      console.log('\n✅ 마이그레이션이 완료되었습니다!');
    } else {
      console.log(`${hasEmail ? '✅' : '❌'} email 컬럼: ${hasEmail ? '존재함' : '없음'}`);
      console.log(`${hasPassword ? '✅' : '❌'} password 컬럼: ${hasPassword ? '존재함' : '없음'}`);
      console.log('\n❌ 마이그레이션이 필요합니다!');
      console.log('💡 다음 명령어를 실행하세요:');
      console.log('   mysql -u root -p orderbean < database/migration_add_auth.sql');
      console.log('   또는 MySQL 클라이언트에서:');
      console.log('   source database/migration_add_auth.sql;');
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 데이터베이스 서버에 연결할 수 없습니다. MySQL이 실행 중인지 확인하세요.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 데이터베이스가 존재하지 않습니다. 먼저 schema.sql을 실행하세요.');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkMigration();

