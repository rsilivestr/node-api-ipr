import { RequestHandler } from 'express';

import pool from '../../pool';
import { UserModel } from './model';

export class UserController {
  static create: RequestHandler = async (req, res) => {
    try {
      const token = await UserModel.create(req.body);
      if (token) {
        res.status(201).send({ token });
      } else {
        res.sendStatus(409);
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
      const user = await UserModel.findOne(user_id);
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
