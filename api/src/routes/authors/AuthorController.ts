import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RequestHandler } from 'express';

import { PrismaErrorCode, prisma } from '@/prisma';

export class AuthorController {
  static create: RequestHandler = async (req, res) => {
    try {
      const { user_id, description = '' } = req.body;

      const createdAuthor = await prisma.author.create({ data: { user_id, description } });

      if (createdAuthor) {
        res.status(201).send(createdAuthor);
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === PrismaErrorCode.NotUnique) {
        res.sendStatus(409);
      } else {
        res.sendStatus(500);
      }
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { limit = 5, offset = 0 } = req.query;

      const authors = await prisma.author.findMany({ take: +limit, skip: +offset });

      res.send(authors);
    } catch {
      res.sendStatus(500);
    }
  };
}
