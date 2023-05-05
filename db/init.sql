CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  surname VARCHAR(30),
  avatar TEXT,
  login VARCHAR(30) UNIQUE,
  passwd_hash TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) NOT NULL,
  description TEXT
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  parent_id INT REFERENCES categories(id)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  poster TEXT,
  images TEXT[],
  tags INT[] DEFAULT '{}',
  author_id INT REFERENCES authors(id) NOT NULL,
  category_id INT REFERENCES categories(id),
  is_published BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  published_at TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  author_id INT REFERENCES users(id) NOT NULL,
  post_id INT REFERENCES posts(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE post_comments (
  post_id INT REFERENCES posts(id) NOT NULL,
  comment_id INT REFERENCES comments(id) NOT NULL
);

CREATE TABLE post_tags (
  post_id INT REFERENCES posts(id) NOT NULL,
  tag_id INT REFERENCES tags(id) NOT NULL
);
