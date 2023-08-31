import { compare } from 'bcrypt';
import { RequestHandler } from 'express';
import { decode, JsonWebTokenError, verify } from 'jsonwebtoken';

import db from '@/db';
import { connect, redisClient } from '@/redisClient';

import { issueTokens } from './utils';

export class AuthController {
  static login: RequestHandler = async (req, res) => {
    try {
      const { login, password } = req.body;
      const userQueryResult = await db.query(
        `
          SELECT id, passwd_hash FROM users
          WHERE login = $1
        `,
        [login]
      );

      if (userQueryResult.rowCount === 0) {
        res.sendStatus(404);
        return;
      }

      const passwordHash = userQueryResult.rows[0].passwd_hash;
      const match = await compare(password, passwordHash);

      if (match) {
        const tokens = await issueTokens(login);
        res.send(tokens);
      } else {
        res.sendStatus(403);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static refresh: RequestHandler = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const payload = await decode(refreshToken);

      if (!payload || typeof payload !== 'object' || !payload.sub) {
        res.sendStatus(404);
        return;
      }

      await connect();
      const secret = await redisClient.get(payload.sub);

      if (!secret) {
        res.sendStatus(404);
        return;
      }

      verify(refreshToken, secret);

      const tokens = await issueTokens(payload.sub);
      res.send(tokens);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        res.sendStatus(404);
      }
      res.sendStatus(500);
    }
  };
}
