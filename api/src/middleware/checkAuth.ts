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
          const user = (await pool.query('SELECT id, is_admin FROM users WHERE login=$1', [(payload as JwtPayload)?.login]))
            .rows[0];
          req.body.user_id = user.id;
          req.body.is_admin = user.is_admin;
          console.log('CHECK AUTH USER: ', user)

          const { rows, rowCount } = await pool.query('SELECT id FROM authors WHERE user_id=$1', [user.id]);
          if (rowCount > 0) {
            req.body.author_id = rows[0].id;
          }
          next();
        }
      });
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
};
