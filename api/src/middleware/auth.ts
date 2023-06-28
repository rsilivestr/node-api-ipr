import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import pool from '../pool';

type Params = {
  allowAdmin?: boolean;
  allowUser?: boolean;
};

export const authMiddleware: (params?: Params) => RequestHandler =
  ({ allowUser = false } = {}) =>
  async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.sendStatus(404);
        return;
      }

      const token = authHeader.split(' ')[1];
      jwt.verify(token, String(process.env.JWT_SECRET), async (err, payload) => {
        if (err) {
          res.sendStatus(404);
        } else {
          const user = (
            await pool.query('SELECT id, is_admin FROM users WHERE login=$1', [(payload as JwtPayload)?.login])
          ).rows[0];

          if (!allowUser && !user.is_admin) {
            res.sendStatus(404);
            return;
          }

          req.body.auth = {
            user_id: user.id,
            is_admin: user.is_admin,
          };

          const { rows, rowCount } = await pool.query('SELECT id FROM authors WHERE user_id=$1', [user.id]);
          if (rowCount > 0) {
            req.body.auth_author_id = rows[0].id;
          }
          next();
        }
      });
    } catch {
      res.sendStatus(500);
    }
  };
