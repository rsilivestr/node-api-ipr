import { hash } from 'bcrypt';
import { RequestHandler } from 'express';

import client from '../../client';

const SALT_ROUNDS = 10;

export class UserController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { login, password, name = '', surname = '', avatar = '' } = req.body;
      const passwordHash = await hash(password, SALT_ROUNDS);
      const existingUsers = await client.query('SELECT login FROM users WHERE login=$1', [login]);
      if (existingUsers.rowCount > 0) {
        res.status(409).send('Such login already exists');
      } else {
        await client.query(
          'INSERT INTO users (login, passwd_hash, name, surname, avatar) VALUES ($1, $2, $3, $4, $5)',
          [login, passwordHash, name, surname, avatar]
        );
        res.sendStatus(201);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static getAll: RequestHandler = async (req, res) => {
    try {
      const { rows } = await client.query(
        'SELECT id, login, name, surname, avatar, created_at FROM users'
      );
      res.send(rows);
    } catch {
      res.send(500);
    }
  };

  static update() {}
  static delete() {}
}
