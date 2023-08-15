import { RequestHandler } from 'express';

import db from '@/db';

export class CommentController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { auth, body, post_id } = req.body;
      if (!auth.user_id || !body || !post_id) {
        res.sendStatus(400);
        return;
      }
      const insertQueryResult = await db.query(
        `INSERT into comments (body, user_id, post_id)
         VALUES ($1, $2, $3)
         RETURNING *
        `,
        [body, auth.user_id, post_id]
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
      const { post_id, limit = '5', offset = '0' } = req.query;
      if (!post_id) {
        res.sendStatus(400);
        return;
      }
      const { rows } = await db.query(
        `SELECT id, body, created_at, updated_at,
         ( 
          SELECT jsonb_build_object (
            'name', users.name,
            'surname', users.surname,
            'avatar', users.avatar
          )
          AS created_by
          FROM users
          WHERE users.id = comments.user_id
         )
         FROM comments
         WHERE comments.post_id = $1
         ORDER BY created_at DESC
         LIMIT $2
         OFFSET $3`,
        [post_id, limit, offset]
      );
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static delete: RequestHandler = async (req, res) => {
    try {
      const { auth } = req.body;
      const { id } = req.params;
      const selectQueryResult = await db.query(
        `SELECT * FROM comments
         WHERE id = $1`,
        [id]
      );
      if (selectQueryResult.rowCount === 0) {
        res.sendStatus(404);
        return;
      }
      if (!auth.is_admin && auth.user_id !== selectQueryResult.rows[0].user_id) {
        res.sendStatus(403);
        return;
      }
      await db.query(
        `DELETE FROM comments
         WHERE id = $1`,
        [id]
      );
      res.sendStatus(204);
    } catch {
      res.sendStatus(500);
    }
  };
}
