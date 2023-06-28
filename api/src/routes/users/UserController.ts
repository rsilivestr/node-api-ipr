import { RequestHandler } from 'express';

import { UserModel } from './UserModel';

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

  static getById: RequestHandler = async (req, res) => {
    try {
      const { user_id } = req.body.auth;
      if (!user_id) {
        res.sendStatus(400);
        return;
      }

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

  static delete: RequestHandler = async (req, res) => {
    try {
      const success = await UserModel.delete(req.params.id);
      res.sendStatus(success ? 204 : 404);
    } catch {
      res.sendStatus(500);
    }
  };
}
