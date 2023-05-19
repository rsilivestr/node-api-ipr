import { hash } from 'bcrypt';
import { RequestHandler } from 'express';
import { sign } from 'jsonwebtoken';

import pool from '../../pool';
import { UserModel } from './model';

const SALT_ROUNDS = 10;

export class UserController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { login, password, name, surname, avatar } = req.body;
      const passwordHash = await hash(password, SALT_ROUNDS);
      const existingUsers = await pool.query('SELECT login FROM users WHERE login=$1', [login]);
      if (existingUsers.rowCount > 0) {
        res.status(409).send('Such login already exists');
      } else {
        await pool.query('INSERT INTO users (login, passwd_hash, name, surname, avatar) VALUES ($1, $2, $3, $4, $5)', [
          login,
          passwordHash,
          name,
          surname,
          avatar,
        ]);
        const token = sign({ login }, String(process.env.JWT_SECRET));
        res.status(201).send({ token });
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT id, login, name, surname, avatar, created_at FROM users');
      res.send(rows);
    } catch {
      res.sendStatus(500);
    }
  };

  static getById: RequestHandler = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
      res.sendStatus(400);
      return;
    }
    try {
      const user = UserModel.findOne(user_id);
      if (!user) {
        res.sendStatus(404);
      } else {
        res.send(user);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static update() {}
  static delete() {}
}
