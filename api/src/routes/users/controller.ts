import { hash } from 'bcrypt';
import { RequestHandler } from 'express';
import { sign } from 'jsonwebtoken';

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
        const token = sign({ login }, String(process.env.JWT_SECRET));
        res.status(201).send({ token });
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static getAll: RequestHandler = async (req, res) => {
    try {
      const { rows } = await client.query('SELECT id, login, name, surname, avatar, created_at FROM users');
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static getOne: RequestHandler = async (req, res) => {
    const { id } = req.params;
    try {
      const { rows, rowCount } = await client.query(
        'SELECT id, login, name, surname, avatar, created_at FROM users WHERE id=$1',
        [id]
      );
      if (rowCount == 0) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static update() {}
  static delete() {}
}
