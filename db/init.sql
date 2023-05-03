CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  surname VARCHAR(30),
  avatar TEXT,
  login VARCHAR(30),
  passwdHash TEXT,
  isAdmin BOOLEAN,
  isAuthor BOOLEAN,
  description TEXT,
  createdAt TIMESTAMP
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
  authorId INT REFERENCES users(id),
  categoryId INT REFERENCES categories(id),
  tags INT[],
  comments INT[],
  isPublished BOOLEAN,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  publishedAt TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  body TEXT,
  authorId INT REFERENCES users(id),
  postId INT REFERENCES posts(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
