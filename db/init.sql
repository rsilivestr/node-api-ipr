CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  surname VARCHAR(50),
  avatar TEXT,
  login VARCHAR(30) UNIQUE,
  passwd_hash TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (login, passwd_hash, name, surname, is_admin)
VALUES (
  'admin',
  '$2b$10$7d4WKblBU2ZoDUSSR.GEdevf4VSYpRXy0wkzXPeWtFjCUk8amYbpG',
  'Admin',
  'Adminov',
  'true'
), (
  'roman',
  '$2b$10$7d4WKblBU2ZoDUSSR.GEdevf4VSYpRXy0wkzXPeWtFjCUk8amYbpG',
  'Roman',
  'Romanov',
  'true'
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) UNIQUE NOT NULL,
  description TEXT
);

INSERT INTO authors (user_id, description) 
VALUES (2, 'Author description');

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  parent_id INT REFERENCES categories(id)
);

INSERT INTO categories (name, parent_id) 
VALUES
  ('Category 1', NULL),
  ('Category 2', 1),
  ('Category 2.1', 2),
  ('Category 2.2', 2),
  ('Category 3', NULL);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

INSERT INTO tags (name) 
VALUES ('Tag 1'), ('Tag 2'), ('Tag 3'), ('Tag 4');

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
