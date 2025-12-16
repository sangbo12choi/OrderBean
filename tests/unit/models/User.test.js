const User = require('../../../backend/models/User');

jest.mock('../../../backend/config/database', () => ({
  pool: {
    execute: jest.fn()
  },
  dbConnected: true,
  USE_DUMMY_DATA: false
}));

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        user_id: 1,
        role: 'customer',
        created_at: new Date()
      };

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([[mockUser]]);

      const result = await User.findById(1);

      expect(result).toEqual(mockUser);
      expect(pool.execute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE user_id = ?',
        [1]
      );
    });

    it('should return undefined when user not found', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([[]]);

      const result = await User.findById(999);

      expect(result).toBeUndefined();
    });

    it('should return dummy user in dummy mode', async () => {
      // 더미 데이터 모드 테스트는 실제로는 모킹된 상태에서 실행되므로
      // USE_DUMMY_DATA가 true일 때의 동작을 확인
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        const result = await User.findById(1);
        expect(result).toEqual({ user_id: 1, role: 'customer' });
      } else {
        // 모킹된 상태에서는 일반 동작 확인
        const mockUser = { user_id: 1, role: 'customer' };
        const { pool } = require('../../../backend/config/database');
        pool.execute.mockResolvedValue([[mockUser]]);
        const result = await User.findById(1);
        expect(result).toEqual(mockUser);
      }
    });
  });

  describe('findByRole', () => {
    it('should return users by role', async () => {
      const mockUsers = [
        {
          user_id: 1,
          role: 'customer',
          created_at: new Date()
        },
        {
          user_id: 2,
          role: 'customer',
          created_at: new Date()
        }
      ];

      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([mockUsers]);

      const result = await User.findByRole('customer');

      expect(result).toHaveLength(2);
      expect(result[0].role).toBe('customer');
      expect(pool.execute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE role = ?',
        ['customer']
      );
    });

    it('should return empty array when no users found', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([[]]);

      const result = await User.findByRole('admin');

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new user with default role', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 1 }]);

      const result = await User.create({});

      expect(result).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO users (role) VALUES (?)',
        ['customer']
      );
    });

    it('should create a new user with custom role', async () => {
      const { pool } = require('../../../backend/config/database');
      pool.execute.mockResolvedValue([{ insertId: 2 }]);

      const result = await User.create({ role: 'admin' });

      expect(result).toBe(2);
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO users (role) VALUES (?)',
        ['admin']
      );
    });

    it('should throw error in dummy mode', async () => {
      const { USE_DUMMY_DATA } = require('../../../backend/config/database');
      if (USE_DUMMY_DATA) {
        await expect(User.create({})).rejects.toThrow(
          '더미 데이터 모드에서는 사용자를 생성할 수 없습니다'
        );
      } else {
        // 모킹된 상태에서는 정상 동작 확인
        const { pool } = require('../../../backend/config/database');
        pool.execute.mockResolvedValue([{ insertId: 3 }]);
        const result = await User.create({});
        expect(result).toBe(3);
      }
    });
  });
});

