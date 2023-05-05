import { RequestHandler } from 'express';

import pool from '../../pool';

export class CategoryController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, parent_id = null } = req.body;
      await pool.query('INSERT INTO categories (name, parent_id) VALUES ($1, $2)', [name, parent_id]);
      res.sendStatus(201);
    } catch {
      res.sendStatus(500);
    }
  };

  static read: RequestHandler = async (req, res) => {
    try {
      const categories = await pool.query('SELECT * FROM categories');
      res.send(categories.rows);
    } catch {
      res.sendStatus(500);
    }
  };
}
