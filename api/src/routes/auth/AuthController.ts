import { compare } from 'bcrypt';
import { RequestHandler } from 'express';
import { decode, JsonWebTokenError, sign, verify, VerifyCallback } from 'jsonwebtoken';

import db from 'db';
import { issueAccessToken, issueRefreshToken, issueTokens } from './utils';
import { connect, redisClient } from 'redisClient';

export class AuthController {
  static login: RequestHandler = async (req, res) => {
    try {
      const { login, password } = req.body;
      const user = await db.query('SELECT id, passwd_hash FROM users WHERE login=$1', [login]);

      if (user.rowCount === 0) {
        res.sendStatus(404);
        return;
      }

      const passwordHash = user.rows[0].passwd_hash;
      const match = await compare(password, passwordHash);

      if (match) {
        const tokens = await issueTokens(login);
        res.status(200).send(tokens);
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
        // res.sendStatus(400);
        res.sendStatus(404);
        return;
      }

      await connect();
      const secret = await redisClient.get(payload.sub);

      if (!secret) {
        // res.sendStatus(403)
        res.sendStatus(404);
        return;
      }

      verify(refreshToken, secret);

      const tokens = await issueTokens(payload.sub);
      res.send(tokens);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        // res.sendStatus(403)
        res.sendStatus(404);
      }
      res.sendStatus(500);
    }
  };
}
