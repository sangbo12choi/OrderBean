const mysql = require('mysql2/promise');
require('dotenv').config();

// 개발 모드에서 더미 데이터 사용 여부
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || !process.env.DB_HOST;

let pool = null;
let dbConnected = false;

if (!USE_DUMMY_DATA) {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'orderbean',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test connection
  pool.getConnection()
    .then(connection => {
      console.log('✅ Database connected successfully');
      dbConnected = true;
      connection.release();
    })
    .catch(err => {
      console.error('❌ Database connection error:', err.message);
      console.error('💡 Tip: 데이터베이스를 설정하거나 .env 파일에 USE_DUMMY_DATA=true를 추가하세요.');
      dbConnected = false;
    });
} else {
  console.log('📝 Using dummy data mode (no database required)');
  dbConnected = true;
}

module.exports = {
  pool,
  dbConnected,
  USE_DUMMY_DATA
};

