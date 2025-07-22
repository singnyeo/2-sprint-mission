-- 1. 사용자
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@%'),
  nickname TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL CHECK (char_length(password) >= 8),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. 간편 로그인
CREATE TABLE socials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,         
  provider_id TEXT NOT NULL,  
  UNIQUE(provider, provider_id)
);

-- 3. 상품
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL CHECK (char_length(name) <= 10),
  description TEXT NOT NULL CHECK (char_length(description) >= 10),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 상품 태그
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) <= 5)
);

-- 5. 게시글
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. 좋아요
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'product')),
  target_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- 7. 댓글
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'product')),
  target_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);