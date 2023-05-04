import { RequestHandler } from 'express';

import client from '../../client';

export class CategoryController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, parentId = null } = req.body;
      await client.query('INSERT INTO categories (name, parent_id) VALUES ($1, $2)', [name, parentId]);
      res.sendStatus(201);
    } catch {
      res.sendStatus(500);
    }
  };

  static read: RequestHandler = async (req, res) => {
    try {
      const categories = await client.query('SELECT * FROM categories');
      res.send(categories.rows);
    } catch {
      res.sendStatus(500);
    }
  };
}
