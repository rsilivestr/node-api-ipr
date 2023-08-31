import { RequestHandler } from 'express';

import db from '@/db';

export class AuthorController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { user_id, description = '' } = req.body;

      const selectQueryResult = await db.query(
        `
          SELECT * FROM authors
          WHERE user_id = $1
        `,
        [user_id]
      );

      if (selectQueryResult.rowCount > 0) {
        res.sendStatus(409);
        return;
      }

      const insertQueryResult = await db.query(
        `
          INSERT INTO authors (user_id, description)
          VALUES ($1, $2)
          RETURNING *
        `,
        [user_id, description]
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
      const { limit = '5', offset = '0' } = req.query;
      const authorsQueryResult = await db.query(
        `
          SELECT id, user_id, description
          FROM authors
          LIMIT $1
          OFFSET $2
        `,
        [limit === '0' ? null : limit, offset]
      );
      res.send(authorsQueryResult.rows);
    } catch {
      res.sendStatus(500);
    }
  };
}
