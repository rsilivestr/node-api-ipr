import { RequestHandler } from 'express';

import { TagModel } from './TagModel';

export class TagController {
  static create: RequestHandler = async (req, res) => {
    try {
      if (!req.body?.is_admin) {
        res.sendStatus(404);
        return;
      }
      const id = await TagModel.create(req.body.name);
      if (id) {
        res.status(201).send({ id });
      } else {
        res.sendStatus(409);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static getAll: RequestHandler = async (req, res) => {
    try {
      const tags = await TagModel.findMany();
      res.send(tags);
    } catch {
      res.sendStatus(500);
    }
  };

  static getById: RequestHandler = async (req, res) => {
    try {
      const tag = await TagModel.findOne(req.params.id);
      if (tag) {
        res.send(tag);
      } else {
        res.sendStatus(404);
      }
    } catch {
      res.sendStatus(500);
    }
  }
}
