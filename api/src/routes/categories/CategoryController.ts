import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RequestHandler } from 'express';

import { prisma, PrismaErrorCodes } from '@/prisma';

export class CategoryController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { name, parent_id = null } = req.body;
      const existing = await prisma.category.findFirst({ where: { name } });

      if (existing) {
        res.sendStatus(409);
        return;
      }

      const inserted = await prisma.category.create({ data: { name, parent_id } });

      if (inserted) {
        res.status(201).send(inserted);
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      console.debug({ err });
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { limit = 5, offset = 0 } = req.query;

      const categories = await prisma.category.findMany({
        orderBy: { id: 'asc' },
        take: +limit,
        skip: +offset,
      });
      res.send(categories);
    } catch {
      res.sendStatus(500);
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      const catgegory = await prisma.category.findFirst({ where: { id: +req.params.id } });

      if (catgegory) {
        res.send(catgegory);
      } else {
        res.sendStatus(404);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static update: RequestHandler = async (req, res) => {
    try {
      if (+req.params.id === +req.body.parent_id) {
        res.sendStatus(400);
        return;
      }

      const updatedCategory = await prisma.category.update({
        where: { id: +req.params.id },
        data: {
          name: req.body.name,
          parent_id: req.body.parent_id,
        },
      });

      if (updatedCategory) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static delete: RequestHandler = async (req, res) => {
    try {
      await prisma.category.delete({ where: { id: +req.params.id } });

      res.sendStatus(204);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === PrismaErrorCodes.NotFound) {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    }
  };
}
