import { RequestHandler } from 'express';

import db from '@/db';

export class CategoryController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, parent_id = null } = req.body;
      const existing = await db.query('SELECT * FROM categories WHERE name=$1', [name]);
      if (existing.rowCount > 0) {
        res.sendStatus(409);
        return;
      }
      const created = await db.query(
        `INSERT INTO categories (name, parent_id)
         VALUES ($1, $2)
         RETURNING *`,
        [name, parent_id]
      );
      res.status(201).send({ id: created.rows[0].id });
    } catch {
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM categories ORDER BY id');
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      const { rows, rowCount } = await db.query('SELECT * FROM categories WHERE id=$1', [req.params.id]);
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
      if (Number(req.params.id) === req.body.parent_id) {
        res.sendStatus(400);
        return;
      }

      const found = await db.query('SELECT * FROM categories WHERE id=$1', [req.params.id]);

      if (found.rowCount === 0) {
        res.sendStatus(404);
        return;
      }

      const newName = req.body.name ?? found.rows[0].name;
      const newParentId = req.body.parent_id ?? found.rows[0].parent_id;

      const { rowCount } = await db.query(
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

  static delete: RequestHandler = async (req, res) => {
    try {
      const { rowCount } = await db.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
      res.sendStatus(rowCount === 1 ? 204 : 404);
    } catch {
      res.sendStatus(500);
    }
  };
}
