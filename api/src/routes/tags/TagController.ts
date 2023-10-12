import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RequestHandler } from 'express';

import { prisma, PrismaErrorCode } from '@/prisma';

export class TagController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { name } = req.body;

      const existingTag = await prisma.tag.findFirst({ where: { name } });

      if (existingTag) {
        res.sendStatus(409);
        return;
      }

      const createdTag = await prisma.tag.create({ data: { name } });

      if (createdTag) {
        res.status(201).send(createdTag);
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { limit = '5', offset = '0' } = req.query;

      const tags = await prisma.tag.findMany({ take: +limit, skip: +offset });

      res.send(tags);
    } catch {
      res.sendStatus(500);
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      const tag = await prisma.tag.findUnique({ where: { id: +req.params.id } });

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
      const updatedTag = await prisma.tag.update({
        where: { id: +req.params.id },
        data: { name: req.body.name },
      });

      if (updatedTag) {
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
      await prisma.tag.delete({ where: { id: +req.params.id } });

      res.sendStatus(204);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === PrismaErrorCode.NotFound) {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    }
  };
}
