import { RequestHandler } from 'express';

import db from 'db';

export class AuthorController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { user_id, description = '' } = req.body;

      const existing = await db.query('SELECT * FROM authors WHERE user_id=$1', [user_id]);

      if (existing.rowCount > 0) {
        res.sendStatus(409);
        return;
      }

      const created = await db.query(
        `INSERT INTO authors (user_id, description)
         VALUES ($1, $2)
         RETURNING *`,
        [user_id, description]
      );
      res.sendStatus(created.rowCount === 1 ? 201 : 404);
    } catch {
      res.sendStatus(500);
    }
  };

  static read: RequestHandler = async (req, res) => {
    try {
      const authors = await db.query('SELECT id, user_id, description FROM authors');
      res.send(authors.rows);
    } catch {
      res.sendStatus(500);
    }
  };
}
