import { RequestHandler } from 'express';

import pool from '../../pool';

export class PostController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { title, body, authorId } = req.body;

      await pool.query('INSERT into posts (title, body, author_id) VALUES ($1, $2, $3)', [title, body, authorId]);

      res.sendStatus(201);
    } catch {
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { author = '0' } = req.query;
      let queryString = '';
      queryString += author ? 'author_id = $1' : 'author_id = $1';
      const { rows } = await pool.query(`SELECT * FROM posts WHERE author_id = $1`, [author]);
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static findById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { rows, rowCount } = await pool.query('SELECT * FROM posts WHERE id=$1', [id]);

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
