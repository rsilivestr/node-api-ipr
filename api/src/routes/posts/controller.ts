import { RequestHandler } from 'express';

import db from 'db';

export class PostController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, body, author_id, tags, category_id } = req.body;

      await db.query('INSERT into posts (title, body, author_id, tags, category_id) VALUES ($1, $2, $3, $4, $5)', [
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
      const {
        author,
        category,
        content,
        created_at,
        created_at__gt,
        created_at__lt,
        limit,
        offset,
        order,
        search,
        tag,
        tags__all,
        tags__in,
        title,
      } = req.query;
      const conditions: string[] = [];
      const conditionValues: any[] = [];

      if (author) {
        conditionValues.push(`%${author}%`);
        conditions.push(
          `author_id IN (
            SELECT authors.id FROM users
            JOIN authors ON users.id = authors.user_id
            WHERE 
              CONCAT(LOWER(users.name), ' ', LOWER(users.surname)) 
              LIKE LOWER($${conditionValues.length})
          )`
        );
      }

      if (category) {
        conditionValues.push(category);
        conditions.push(`category_id = $${conditionValues.length}`);
      }

      if (content) {
        conditionValues.push(`%${content}%`);
        conditions.push(`LOWER(body) LIKE LOWER($${conditionValues.length})`);
      }

      if (tag) {
        conditionValues.push(`${tag}`);
        conditions.push(`$${conditionValues.length} = ANY(tags)`);
      }

      if (tags__in) {
        conditionValues.push(JSON.parse(String(tags__in)));
        conditions.push(`$${conditionValues.length} @> (tags)`);
      }

      if (tags__all) {
        conditionValues.push(JSON.parse(String(tags__all)));
        conditions.push(`$${conditionValues.length} <@ (tags)`);
      }

      if (title) {
        conditionValues.push(`%${title}%`);
        conditions.push(`LOWER(title) LIKE LOWER($${conditionValues.length})`);
      }

      const queryString = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const { rows } = await db.query(
        `SELECT id, title, body, poster, images, created_at, updated_at, published_at,
          (
            SELECT json_build_object (
              'name', users.name,
              'surname', users.surname,
              'avatar', users.avatar,
              'description', authors.description
            )
            AS author
            FROM authors
            JOIN users ON authors.user_id = users.id
            WHERE authors.id = posts.author_id
          ), 
          ARRAY (
            SELECT name FROM tags
            WHERE tags.id = ANY (posts.tags)
          ) as tags, 
          ARRAY (
            WITH RECURSIVE postCategories AS (
              SELECT name FROM categories
              WHERE categories.id = posts.category_id
              UNION ALL
              SELECT c.name FROM categories c
              INNER JOIN categories ON categories.parent_id = c.id
              WHERE categories.id = posts.category_id
            ) SELECT * FROM postCategories
          ) as categories
        FROM posts
        ${queryString}`,
        conditionValues
      );
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static findById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { rows, rowCount } = await db.query('SELECT * FROM posts WHERE id=$1', [id]);

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
