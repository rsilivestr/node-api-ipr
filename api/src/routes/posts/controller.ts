import { RequestHandler } from 'express';

import client from '../../client';

export class PostController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, body, authorId } = req.body;

      await client.query('INSERT into posts (title, body, author_id) VALUES ($1, $2, $3)', [title, body, authorId]);

      res.sendStatus(201);
    } catch {
      res.sendStatus(500);
    }
  };

  static read: RequestHandler = async (req, res) => {
    try {
      const { rows } = await client.query('SELECT * FROM posts');
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static findById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { rows, rowCount } = await client.query('SELECT * FROM posts WHERE id=$1', [id]);

      if (rowCount === 0) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    } catch {
      res.sendStatus(500);
    }
  };
}
