import { hash } from 'bcrypt';
import { RequestHandler } from 'express';

import db from '@/db';
import { issueTokens } from '@/routes/auth/utils';

const SALT_ROUNDS = 10;

export class UserController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { login, password, name, surname, avatar } = req.body;
      const existingUsers = await db.query(
        `SELECT login FROM users
         WHERE login=$1`,
        [login]
      );

      if (existingUsers.rowCount > 0) {
        res.sendStatus(409);
        return;
      }

      const passwordHash = await hash(password, SALT_ROUNDS);
      await db.query(
        `INSERT INTO users (login, passwd_hash, name, surname, avatar)
         VALUES ($1, $2, $3, $4, $5)`,
        [login, passwordHash, name, surname, avatar]
      );
      const tokens = await issueTokens(login);

      res.status(201).send(tokens);
    } catch {
      res.sendStatus(500);
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      const { user_id } = req.body.auth;
      if (!user_id) {
        res.sendStatus(400);
        return;
      }
      const { rows, rowCount } = await db.query(
        `SELECT id, login, name, surname, avatar, is_admin, created_at
         FROM users
         WHERE id=$1`,
        [user_id]
      );
      if (rowCount === 0) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static delete: RequestHandler = async (req, res) => {
    try {
      const { rowCount } = await db.query(
        `DELETE FROM users
         WHERE id=$1
         RETURNING *`,
        [req.params.id]
      );
      res.sendStatus(rowCount === 1 ? 204 : 404);
    } catch {
      res.sendStatus(500);
    }
  };
}
