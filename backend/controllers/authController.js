const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const authController = {
  // POST /api/auth/register - 회원가입
  async register(req, res) {
    try {
      const { email, password, role = 'customer' } = req.body;

      // 입력 검증
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'email과 password는 필수입니다.' 
        });
      }

      // 이메일 형식 검증 (간단한 검증)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: '유효하지 않은 이메일 형식입니다.' 
        });
      }

      // 비밀번호 길이 검증
      if (password.length < 6) {
        return res.status(400).json({ 
          error: '비밀번호는 최소 6자 이상이어야 합니다.' 
        });
      }

      // 중복 이메일 확인
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: '이미 등록된 이메일입니다.' 
        });
      }

      // 사용자 생성
      const user = await User.create({ email, password, role });

      // JWT 토큰 생성
      const token = jwt.sign(
        { userId: user.user_id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        token,
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error registering user:', error);
      console.error('Error details:', {
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
        message: error.message
      });
      
      // MySQL 에러 처리
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: '이미 등록된 이메일입니다.' 
        });
      }
      
      // 컬럼이 없는 경우 (마이그레이션 미실행)
      if (error.code === 'ER_BAD_FIELD_ERROR' || error.sqlMessage?.includes('Unknown column')) {
        return res.status(500).json({ 
          error: '데이터베이스 마이그레이션이 필요합니다.',
          message: 'users 테이블에 email 또는 password 컬럼이 없습니다. database/migration_add_auth.sql 파일을 실행해주세요.'
        });
      }
      
      // SQL 문법 오류
      if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_SYNTAX_ERROR') {
        return res.status(500).json({ 
          error: '데이터베이스 쿼리 오류가 발생했습니다.',
          message: error.sqlMessage || error.message
        });
      }
      
      res.status(500).json({ 
        error: '회원가입 중 오류가 발생했습니다.',
        message: error.message || error.sqlMessage || '알 수 없는 오류가 발생했습니다.'
      });
    }
  },

  // POST /api/auth/login - 로그인
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 입력 검증
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'email과 password는 필수입니다.' 
        });
      }

      // 사용자 조회
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          error: '이메일 또는 비밀번호가 올바르지 않습니다.' 
        });
      }

      // 비밀번호 확인
      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: '이메일 또는 비밀번호가 올바르지 않습니다.' 
        });
      }

      // JWT 토큰 생성
      const token = jwt.sign(
        { userId: user.user_id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: '로그인되었습니다.',
        token,
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ 
        error: '로그인 중 오류가 발생했습니다.',
        message: error.message 
      });
    }
  },

  // GET /api/auth/me - 현재 사용자 정보 조회
  async getMe(req, res) {
    try {
      // authenticateToken 미들웨어를 통해 req.user가 설정됨
      res.json({
        user: {
          user_id: req.user.user_id,
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error) {
      console.error('Error getting user info:', error);
      res.status(500).json({ 
        error: '사용자 정보 조회 중 오류가 발생했습니다.',
        message: error.message 
      });
    }
  }
};

module.exports = authController;

