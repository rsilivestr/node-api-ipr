import { compare } from 'bcrypt';
import { RequestHandler } from 'express';
import { sign } from 'jsonwebtoken';

import pool from 'pool';
import { issueAccessToken, issueRefreshToken, issueTokens } from './utils';

export class AuthController {
  static login: RequestHandler = async (req, res) => {
    try {
      const { login, password } = req.body;
      const user = await pool.query('SELECT id, passwd_hash FROM users WHERE login=$1', [login]);

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
}
