-- OrderBean Seed Data
USE orderbean;

-- 기본 사용자 생성
INSERT INTO users (role) VALUES 
    ('customer'),
    ('customer'),
    ('admin');

-- 기본 메뉴 생성
INSERT INTO menus (name, price, options) VALUES 
    ('아메리카노', 4000, '["HOT", "ICE", "SIZE_S", "SIZE_M", "SIZE_L"]'),
    ('카페라떼', 4500, '["HOT", "ICE", "SIZE_S", "SIZE_M", "SIZE_L"]'),
    ('카푸치노', 4500, '["HOT", "ICE", "SIZE_S", "SIZE_M", "SIZE_L"]'),
    ('카라멜 마키아토', 5000, '["HOT", "ICE", "SIZE_S", "SIZE_M", "SIZE_L"]'),
    ('바닐라라떼', 5000, '["HOT", "ICE", "SIZE_S", "SIZE_M", "SIZE_L"]'),
    ('에스프레소', 3000, '["HOT"]'),
    ('콜드브루', 4500, '["ICE", "SIZE_M", "SIZE_L"]');

-- 샘플 주문 생성 (선택사항)
-- INSERT INTO orders (user_id, status) VALUES (1, '접수');
-- INSERT INTO order_items (order_id, menu_id, options) VALUES 
--     (1, 1, '{"temperature": "HOT", "size": "SIZE_M"}');

