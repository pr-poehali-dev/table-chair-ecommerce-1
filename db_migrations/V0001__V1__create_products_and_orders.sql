
CREATE TABLE t_p89449118_table_chair_ecommerc.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  material VARCHAR(100) NOT NULL,
  style VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT,
  tag VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p89449118_table_chair_ecommerc.orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  comment TEXT,
  cart JSONB,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p89449118_table_chair_ecommerc.products (name, category, material, style, price, image_url, tag) VALUES
('Стол Директор Pro', 'Столы', 'Дуб', 'Классика', 89000, 'https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/9521eb3a-d91f-439c-869e-43ea6fe97b29.jpg', 'Хит продаж'),
('Кресло Престиж', 'Стулья', 'Кожа', 'Классика', 47500, 'https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/4e1ee7f5-1321-4b5f-b8b9-80868fdd8a1a.jpg', 'Новинка'),
('Обеденная группа Nord', 'Столы', 'Массив', 'Скандинавский', 134000, 'https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/606016e5-59ef-4be6-9c4c-20c8b993d56d.jpg', NULL),
('Стол переговорный Elite', 'Столы', 'Дуб', 'Современный', 215000, 'https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/9521eb3a-d91f-439c-869e-43ea6fe97b29.jpg', 'Премиум'),
('Стул Мадрид', 'Стулья', 'Ткань', 'Современный', 18900, 'https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/4e1ee7f5-1321-4b5f-b8b9-80868fdd8a1a.jpg', NULL),
('Стол рабочий Artisan', 'Столы', 'Массив', 'Скандинавский', 62000, 'https://cdn.poehali.dev/projects/be1b219e-f7ec-4829-9956-6c1dc29e759f/files/606016e5-59ef-4be6-9c4c-20c8b993d56d.jpg', NULL);
