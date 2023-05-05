import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import pool from '../pool';

export const checkAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, String(process.env.JWT_SECRET), async (err, payload) => {
        if (err) {
          res.sendStatus(403);
        } else {
          const userId = (await pool.query('SELECT id FROM users WHERE login=$1', [(payload as JwtPayload)?.login]))
            .rows[0].id;
          const authorId = (await pool.query('SELECT id FROM authors WHERE user_id=$1', [userId])).rows[0].id;

          req.body.authorId = authorId;
          next();
        }
      });
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(500);
  }
};
