import { RequestHandler } from 'express';

import client from '../../client';

export class TagsController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { name } = req.body;
      await client.query('INSERT INTO tags (name) VALUES ($1)', [name]);
      res.sendStatus(201);
    } catch {
      res.sendStatus(500);
    }
  };

  static read: RequestHandler = async (req, res) => {
    try {
      const tags = await client.query('SELECT * FROM tags');
      res.send(tags.rows);
    } catch {
      res.sendStatus(500);
    }
  };
}
