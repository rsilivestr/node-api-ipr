import { RequestHandler } from 'express';

import db from '@/db';

export class TagController {
  static create: RequestHandler = async (req, res) => {
    try {
      const existing = await db.query(
        `
          SELECT * FROM tags
          WHERE name = $1
        `,
        [req.body.name]
      );
      if (existing.rowCount > 0) {
        res.sendStatus(409);
        return;
      }
      const created = await db.query(
        `
          INSERT INTO tags (name)
          VALUES ($1)
          RETURNING id
        `,
        [req.body.name]
      );
      if (created.rowCount > 0) {
        res.status(201).send(created.rows[0]);
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
      const { rows: tags } = await db.query(
        `
          SELECT * FROM tags
          ORDER BY id
          LIMIT $1
          OFFSET $2
        `,
        [limit === '0' ? null : limit, offset]
      );
      res.send(tags);
    } catch {
      res.sendStatus(500);
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      const { rows, rowCount } = await db.query(
        `
          SELECT * FROM tags
          WHERE id = $1
        `,
        [req.params.id]
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
      const { rowCount } = await db.query(
        `
          UPDATE tags
          SET name = $2
          WHERE id = $1
          RETURNING *
        `,
        [req.params.id, req.body.name]
      );
      res.sendStatus(rowCount === 1 ? 204 : 404);
    } catch {
      res.sendStatus(500);
    }
  };

  static delete: RequestHandler = async (req, res) => {
    try {
      const { rowCount } = await db.query(
        `
          DELETE FROM tags
          WHERE id = $1
        `,
        [req.params.id]
      );
      res.sendStatus(rowCount === 1 ? 204 : 404);
    } catch {
      res.sendStatus(500);
    }
  };
}
