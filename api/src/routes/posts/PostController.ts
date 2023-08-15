import { RequestHandler } from 'express';

import db from '@/db';

export class PostController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { auth, body, category_id, tags, title } = req.body;
      const insertQueryResult = await db.query(
        `INSERT into posts (title, body, author_id, tags, category_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, body, auth.author_id, tags, category_id]
      );
      if (insertQueryResult.rowCount > 0) {
        res.status(201).send(insertQueryResult.rows[0]);
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const {
        author,
        category, // id
        content,
        created_at, // accepts ISO date
        created_at__gt,
        created_at__lt,
        limit = '5', // entries per page
        offset = '0', // page offset, number of skipped entries
        order = 'id',
        search,
        tag, // id
        tags__all,
        tags__in,
        title,
      } = req.query;

      const conditions: string[] = [];
      const conditionValues: string[] = [];

      if (author) {
        conditionValues.push(`%${author}%`);
        conditions.push(
          `author_id IN (
            SELECT authors.id FROM users
            JOIN authors ON users.id = authors.user_id
            WHERE
              CONCAT(users.name, ' ', users.surname)
              ILIKE $${conditionValues.length}
          )`
        );
      }

      if (category) {
        conditionValues.push(String(category));
        conditions.push(`category_id = $${conditionValues.length}`);
      }

      if (content) {
        conditionValues.push(`%${content}%`);
        conditions.push(`body ILIKE $${conditionValues.length}`);
      }

      if (created_at) {
        conditionValues.push(String(created_at));
        conditions.push(`created_at = $${conditionValues.length}::date`);
      } else if (created_at__gt) {
        conditionValues.push(String(created_at__gt));
        conditions.push(`created_at > $${conditionValues.length}::date`);
      } else if (created_at__lt) {
        conditionValues.push(String(created_at__lt));
        conditions.push(`created_at < $${conditionValues.length}::date`);
      }

      if (search) {
        conditionValues.push(`%${search}%`);
        conditions.push(`
          title ILIKE $${conditionValues.length}
          OR body ILIKE $${conditionValues.length}
          OR author_id IN (
            SELECT authors.id FROM users
            JOIN authors ON users.id = authors.user_id
            WHERE 
              CONCAT(users.name, ' ', users.surname) 
              ILIKE $${conditionValues.length}
          )
          OR tags && ARRAY (
            SELECT tags.id FROM tags
            WHERE tags.name ILIKE $${conditionValues.length}
          )
          OR category_id IN (
            SELECT categories.id FROM categories
            WHERE categories.name ILIKE $${conditionValues.length}
          )
        `)
      }

      if (tag) {
        conditionValues.push(String(tag));
        conditions.push(`$${conditionValues.length} = ANY (tags)`);
      }

      if (tags__in) {
        conditionValues.push(JSON.parse(String(tags__in)));
        conditions.push(`$${conditionValues.length} && (tags)`);
      }

      if (tags__all) {
        conditionValues.push(JSON.parse(String(tags__all)));
        conditions.push(`$${conditionValues.length} <@ (tags)`);
      }

      if (title) {
        conditionValues.push(`%${title}%`);
        conditions.push(`title ILIKE $${conditionValues.length}`);
      }

      let queryString = ' WHERE is_published';

      queryString += conditions.reduce((acc, condition) => `${acc} AND ${condition}`, '');

      let orderString = '';
      switch (order) {
        case 'author':
          orderString = `result.author ->> 'surname', result.author ->> 'name'`;
          break;
        case 'category':
          orderString = 'result.categories[1]'
          break;
        case 'date':
        case 'date-asc':
          orderString = 'result.created_at ASC';
          break;
        case 'date-desc':
          orderString = 'result.created_at DESC';
          break;
        case 'image-count':
        case 'image-count-desc':
          orderString = 'array_length(result.images, 1) DESC NULLS LAST';
          break;
        case 'image-count-asc':
          orderString = 'array_length(result.images, 1) ASC NULLS FIRST';
          break;
        default: 
          orderString = 'result.id';
      }      

      conditionValues.push(String(limit));
      queryString += ` LIMIT $${conditionValues.length}`;

      conditionValues.push(String(offset));
      queryString += ` OFFSET $${conditionValues.length}`;

      const { rows } = await db.query(
        `SELECT * FROM (
          SELECT id, title, body, poster, images, is_published, created_at, updated_at, published_at,
            (
              SELECT jsonb_build_object (
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
          ${queryString}
        ) result ORDER BY ${orderString}`,
        conditionValues
      );
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { rows, rowCount } = await db.query(
        `SELECT * FROM posts
         WHERE id=$1`,
        [id]
      );

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
