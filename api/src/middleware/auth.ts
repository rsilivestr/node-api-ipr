import { RequestHandler } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';

import db from '@/db';

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
        res.sendStatus(allowUser ? 401 : 404);
        return;
      }

      const token = authHeader.split(' ')[1];
      const payload = verify(token, String(process.env.ACCESS_TOKEN_SECRET));

      if (!payload || typeof payload !== 'object' || !payload.sub) {
        res.sendStatus(404);
        return;
      }
      const userQueryResult = await db.query(
        `
          SELECT id, is_admin FROM users
          WHERE login = $1
        `,
        [payload.sub]
      );
      const user = userQueryResult.rows[0];

      if (!user || (!allowUser && !user.is_admin)) {
        res.sendStatus(404);
        return;
      }

      req.body.auth = {
        user_id: user.id,
        is_admin: user.is_admin,
      };

      const authorQueryResult = await db.query(
        `
          SELECT id FROM authors
          WHERE user_id = $1
        `,
        [user.id]
      );
      if (authorQueryResult.rowCount > 0) {
        req.body.auth.author_id = authorQueryResult.rows[0].id;
      }

      next();
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(500);
    }
  };
