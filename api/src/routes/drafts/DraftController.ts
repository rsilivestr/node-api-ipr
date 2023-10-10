import { RequestHandler } from 'express';

import db from '@/db';

export class DraftController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { auth, post_id, title, body, poster, images, category, tags } = req.body;
      const hasNoIds = !post_id || !auth.author_id;
      if (hasNoIds) {
        res.sendStatus(400);
        return;
      }
      const insertQueryResult = await db.query(
        `
          INSERT INTO drafts (post_id, author_id, title, body, poster, images, category_id, tags)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `,
        [post_id, auth.author_id, title, body, poster, images, category, tags]
      );
      if (insertQueryResult.rowCount === 1) {
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
      const { auth } = req.body;
      const { post_id = null, limit = '5', offset = '0' } = req.query;
      const { rows: drafts } = await db.query(
        `
          SELECT * FROM drafts
          WHERE author_id = $1 AND $2::int IS NULL OR post_id = $2
          ORDER BY id
          LIMIT $3
          OFFSET $4
        `,
        [auth.author_id, post_id, limit === '0' ? null : limit, offset]
      );
      res.send(drafts);
    } catch {
      res.sendStatus(500);
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      const { auth } = req.body;
      const { id } = req.params;
      const { rows, rowCount } = await db.query(
        `
          SELECT * FROM drafts
          WHERE author_id = $1 AND id = $2
        `,
        [auth.author_id, id]
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

  static update: RequestHandler = async (req, res) => {
    try {
      const { auth, title, body, poster, images, category, tags } = req.body;
      const { id } = req.params;
      const queryResult = await db.query(
        `
          UPDATE drafts
          SET
            title = $1,
            body = $2,
            poster = $3,
            images = $4,
            category_id = $5,
            tags = $6,
            updated_at = NOW()
          WHERE author_id = $7 AND id = $8
          RETURNING *
        `,
        [title, body, poster, images, category, tags, auth.author_id, id]
      );
      if (queryResult.rowCount > 0) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static delete: RequestHandler = async (req, res) => {
    try {
      const { auth } = req.body;
      const { id } = req.params;
      const queryResult = await db.query(
        `
          DELETE FROM drafts
          WHERE author_id = $1 AND id = $2
        `,
        [auth.author_id, id]
      );
      if (queryResult.rowCount > 0) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static publish: RequestHandler = async (req, res) => {
    try {
      const { auth } = req.body;
      const { id } = req.params;

      const updateQueryResult = await db.query(
        `
          UPDATE posts
          SET
            title = draft.title,
            body = draft.body,
            poster = draft.poster,
            images = draft.images,
            category_id = draft.category_id,
            tags = draft.tags,
            updated_at = NOW(),
            published_at = COALESCE(published_at, NOW()),
            is_published = TRUE
          FROM (
            SELECT * FROM drafts
            WHERE drafts.author_id = $1 AND drafts.id = $2
          ) AS draft
          WHERE posts.id = draft.post_id
          RETURNING *
        `,
        [auth.author_id, id]
      );

      if (updateQueryResult.rowCount > 0) {
        await db.query(`DELETE FROM drafts WHERE id = $1`, [id]);

        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch {
      res.sendStatus(500);
    }
  };
}
