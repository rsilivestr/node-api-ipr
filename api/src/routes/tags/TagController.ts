import { RequestHandler } from 'express';

import { TagModel } from './TagModel';

export class TagController {
  static create: RequestHandler = async (req, res) => {
    try {
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
  };

  static update: RequestHandler = async (req, res) => {
    try {
      const success = await TagModel.update(req.params.id, req.body.name);
      res.sendStatus(success ? 204 : 404);
    } catch {
      res.sendStatus(500);
    }
  };

  static delete: RequestHandler = async (req, res) => {
    try {
      const success = await TagModel.delete(req.params.id);
      res.sendStatus(success ? 204 : 404);
    } catch {
      res.sendStatus(500);
    }
  }
}
