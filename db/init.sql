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
  'false'
), (
  'vasya',
  '$2b$10$7d4WKblBU2ZoDUSSR.GEdevf4VSYpRXy0wkzXPeWtFjCUk8amYbpG',
  'Vasily',
  'Vasilev',
  'false'
), (
  'william_doe',
  '$2b$10$7d4WKblBU2ZoDUSSR.GEdevf4VSYpRXy0wkzXPeWtFjCUk8amYbpG',
  'William',
  'Doe',
  'false'
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) UNIQUE NOT NULL,
  description TEXT
);

INSERT INTO authors (user_id, description) 
VALUES (2, 'Author description'), (4, 'John description');

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
  ('Category 2.3', 2),
  ('Category 3', NULL);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

INSERT INTO tags (name) 
VALUES ('Tag 1'), ('Tag 2'), ('Tag 3'), ('Tag 4'), ('Tag 5'), ('Tag 6'), ('Tag 7');

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  poster TEXT,
  images TEXT[],
  tags INT[] DEFAULT '{}',
  author_id INT REFERENCES authors(id) NOT NULL,
  category_id INT REFERENCES categories(id),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  published_at TIMESTAMP
);

INSERT INTO posts (title, body, poster, images, tags, category_id, author_id, is_published, created_at)
VALUES 
  ('Post about ducks', 'Ducks are awesome', 'duck.webp', '{ "a.webp", "b.webp" }', '{ 1, 2 }', '1', '1', 'true', '2020-05-12'),
  ('How to make a website', 'Go to MetaLamp', 'metalamp.webp', '{ "c.webp" }', '{ 1, 3 }', '2', '2', 'true', '2020-10-15'),
  ('On memes', 'Memes are a waste of time', 'meme.webp', '{ "d.webp", "e.webp", "f.webp" }', '{ 3 }', '4', '1', 'true', '2021-04-05'),
  ('About rabbits', 'Rabbits are awesome', 'rabbit.webp', '{ "g.webp", "h.webp" }', '{ 1, 3, 4 }', '3', '1', 'true', '2021-07-08'),
  ('How to bake a cake', 'Ask your mom', 'mom.webp', '{}', '{ 1, 4 }', '2', '2', 'true', '2022-01-01'),
  ('Lingva latina', 'Lingua latina non lorem ipsum est', 'latin.webp', '{ "i.webp" }', '{ 3, 4 }', '1', '2', 'false', '2022-12-25');

CREATE TABLE drafts (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) NOT NULL,
  author_id INT REFERENCES authors(id) NOT NULL,
  title VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  poster TEXT,
  images TEXT[],
  tags INT[] DEFAULT '{}',
  category_id INT REFERENCES categories(id) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO drafts (author_id, post_id, title, body, poster, images, tags, category_id)
VALUES
  (1, 1, 'Post about ducks, edited', 'Ducks are cool', 'duck.webp', '{ "a.webp", "b.webp" }', '{ 1, 2 }', 1),
  (1, 3, 'About memes', 'Memes are a waste of time', 'meme1.webp', '{ "d.webp", "e.webp" }', '{ 3 }', 3);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  user_id INT REFERENCES users(id) NOT NULL,
  post_id INT REFERENCES posts(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO comments (body, user_id, post_id)
VALUES
  ('Comment 1', 3, 1),
  ('Comment 2', 3, 1),
  ('Comment 3', 3, 2),
  ('Comment 4', 3, 2),
  ('Comment 5', 3, 2),
  ('Comment 6', 3, 3),
  ('Comment 7', 3, 4),
  ('Comment 8', 3, 4),
  ('Comment 9', 3, 5),
  ('Comment 10', 3, 5);