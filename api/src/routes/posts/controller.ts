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
    const posts = await client.query('SELECT * FROM posts');

    res.send(posts.rows);
  };
}
