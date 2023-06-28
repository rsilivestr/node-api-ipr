import { RequestHandler } from 'express';

import pool from '../../pool';

export class CategoryController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, parent_id = null, is_admin } = req.body;

      if (!is_admin) {
        res.sendStatus(404);
        return;
      }

      const existing = await pool.query('SELECT * FROM categories WHERE name=$1', [name]);
      if (existing.rowCount > 0) {
        res.sendStatus(409);
        return;
      }
      console.debug('FOO')
      const created = await pool.query(
        `INSERT INTO categories (name, parent_id)
         VALUES ($1, $2)
         RETURNING *`,
        [name, parent_id]
      );
      console.debug(created.rowCount, created.rows[0])
      res.status(201).send({ id: created.rows[0].id });
    } catch {
      res.sendStatus(500);
    }
  };

  static getAll: RequestHandler = async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM categories');
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };
}
