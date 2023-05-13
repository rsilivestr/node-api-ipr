import { compare } from 'bcrypt';
import { RequestHandler } from 'express';
import { sign } from 'jsonwebtoken';

import pool from '../../pool';

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
        const token = sign({ login }, String(process.env.JWT_SECRET));
        res.status(200).send({ token });
      } else {
        res.sendStatus(403);
      }
    } catch {
      res.sendStatus(500);
    }
  };
}
