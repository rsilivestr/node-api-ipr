CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  surname VARCHAR(30),
  avatar TEXT,
  login VARCHAR(30),
  passwd_hash TEXT,
  is_admin BOOLEAN,
  is_author BOOLEAN,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  body TEXT,
  poster TEXT,
  author_id INT REFERENCES users(id),
  category_id INT REFERENCES categories(id),
  tags INT[],
  comments INT[],
  is_published BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  body TEXT,
  author_id INT REFERENCES users(id),
  post_id INT REFERENCES posts(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
