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
      console.debug('FOO');
      const created = await pool.query(
        `INSERT INTO categories (name, parent_id)
         VALUES ($1, $2)
         RETURNING *`,
        [name, parent_id]
      );
      console.debug(created.rowCount, created.rows[0]);
      res.status(201).send({ id: created.rows[0].id });
    } catch {
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM categories ORDER BY id');
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      const { rows, rowCount } = await pool.query('SELECT * FROM categories WHERE id=$1', [req.params.id]);
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
      if (!req.body.is_admin) {
        res.sendStatus(404);
        return;
      }

      if (Number(req.params.id) === req.body.parent_id) {
        res.sendStatus(400);
        return;
      }

      const found = await pool.query('SELECT * FROM categories WHERE id=$1', [req.params.id]);

      if (found.rowCount === 0) {
        res.sendStatus(404);
        return;
      }

      const newName = req.body.name ?? found.rows[0].name;
      const newParentId = req.body.parent_id ?? found.rows[0].parent_id;

      const { rowCount } = await pool.query(
        `UPDATE categories
         SET name=$2, parent_id=$3
         WHERE id=$1 RETURNING *`,
        [req.params.id, newName, newParentId]
      );
      res.sendStatus(rowCount === 1 ? 204 : 404);
    } catch {
      res.sendStatus(500);
    }
  };
}
