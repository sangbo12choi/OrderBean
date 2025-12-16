const menuController = require('../../../backend/controllers/menuController');
const Menu = require('../../../backend/models/Menu');

jest.mock('../../../backend/models/Menu');

describe('Menu Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getMenus', () => {
    it('should return formatted menus', async () => {
      const mockMenus = [
        {
          menu_id: 1,
          name: '아메리카노',
          price: 4000,
          options: JSON.stringify(['HOT', 'ICE'])
        },
        {
          menu_id: 2,
          name: '카페라떼',
          price: 4500,
          options: ['HOT', 'ICE']
        }
      ];

      Menu.findAll.mockResolvedValue(mockMenus);

      await menuController.getMenus(req, res);

      expect(Menu.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        menus: [
          {
            menu_id: 1,
            name: '아메리카노',
            price: 4000,
            options: ['HOT', 'ICE']
          },
          {
            menu_id: 2,
            name: '카페라떼',
            price: 4500,
            options: ['HOT', 'ICE']
          }
        ]
      });
    });

    it('should return empty array when no menus exist', async () => {
      Menu.findAll.mockResolvedValue([]);

      await menuController.getMenus(req, res);

      expect(res.json).toHaveBeenCalledWith({ menus: [] });
    });

    it('should handle errors and return 500', async () => {
      const error = new Error('Database error');
      Menu.findAll.mockRejectedValue(error);

      await menuController.getMenus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: '메뉴 조회 중 오류가 발생했습니다.',
        message: 'Database error',
        hint: expect.any(String)
      });
    });
  });
});

