import { RequestHandler } from 'express';

import pool from '../../pool';

export class AuthorController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { userId, description = '' } = req.body;
      await pool.query('INSERT INTO authors (user_id, description) VALUES ($1, $2)', [userId, description]);
      res.sendStatus(201);
    } catch {
      res.sendStatus(500);
    }
  };

  static read: RequestHandler = async (req, res) => {
    console.log(req.params);
    console.log(req.path);

    try {
      const authors = await pool.query('SELECT id, user_id, description FROM authors');
      res.send(authors.rows);
    } catch {
      res.sendStatus(500);
    }
  };
}
