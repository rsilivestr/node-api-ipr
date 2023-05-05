import { RequestHandler } from 'express';

import pool from '../../pool';

export class PostController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, body, author_id, tags, category_id } = req.body;

      await pool.query('INSERT into posts (title, body, author_id, tags, category_id) VALUES ($1, $2, $3, $4, $5)', [
        title,
        body,
        author_id,
        tags,
        category_id,
      ]);

      res.sendStatus(201);
    } catch {
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { author = '0' } = req.query;
      let queryString = '';
      queryString += author ? 'author_id = $1' : 'author_id = $1';
      const { rows } = await pool.query(
        `SELECT json_build_object (
          'id', posts.id,
          'title', posts.title,
          'body', posts.body,
          'poster', posts.poster,
          'images', posts.images,
          'created_at', posts.created_at,
          'updated_at', posts.updated_at,
          'published_at', posts.published_at,
          'tags', ARRAY (
            SELECT name FROM tags
            WHERE tags.id = ANY (posts.tags)
          ),
          'categories', ARRAY (
            WITH RECURSIVE postCategories AS (
              SELECT name FROM categories
              WHERE categories.id = posts.category_id
              UNION ALL
              SELECT c.name FROM categories c
              INNER JOIN categories ON categories.parent_id = c.id
              WHERE categories.id = posts.category_id
            ) SELECT * FROM postCategories
          ),
          'author', (
            SELECT json_build_object (
              'name', users.name,
              'surname', users.surname,
              'description', authors.description
            )
            FROM authors
            JOIN users ON authors.user_id = users.id
            WHERE authors.id = posts.author_id
          )
        ) AS data FROM posts`
      );
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static findById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { rows, rowCount } = await pool.query('SELECT * FROM posts WHERE id=$1', [id]);

      if (rowCount === 0) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    } catch {
      res.sendStatus(500);
    }
  };
}
