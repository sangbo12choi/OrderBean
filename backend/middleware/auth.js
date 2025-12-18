const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: '인증 토큰이 필요합니다.',
        message: '로그인이 필요합니다.' 
      });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 사용자 정보 조회
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: '유효하지 않은 토큰입니다.',
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: '유효하지 않은 토큰입니다.',
        message: '토큰이 손상되었습니다.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: '토큰이 만료되었습니다.',
        message: '다시 로그인해주세요.' 
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: '인증 처리 중 오류가 발생했습니다.',
      message: error.message 
    });
  }
};

// 관리자 권한 확인 미들웨어
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: '권한이 없습니다.',
      message: '관리자 권한이 필요합니다.' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  JWT_SECRET
};

