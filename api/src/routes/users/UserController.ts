import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { hash } from 'bcrypt';
import { RequestHandler } from 'express';

import { prisma, PrismaErrorCodes } from '@/prisma';
import { issueTokens } from '@/routes/auth/utils';

const SALT_ROUNDS = 10;

export class UserController {
  static create: RequestHandler = async (req, res) => {
    try {
      await prisma.$connect();

      const { login, password, name, surname, avatar } = req.body;

      const existingUser = await prisma.user.findFirst({ where: { login } });

      if (existingUser) {
        res.sendStatus(409);
        return;
      }

      const passwd_hash = await hash(password, SALT_ROUNDS);

      const insertedUser = await prisma.user.create({
        data: { login, passwd_hash, name, surname, avatar },
      });

      if (insertedUser) {
        const tokens = await issueTokens(login);
        res.status(201).send(tokens);
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(500);
    } finally {
      await prisma.$disconnect();
    }
  };

  static findOne: RequestHandler = async (req, res) => {
    try {
      await prisma.$connect();

      const { user_id } = req.body.auth;

      if (!user_id) {
        res.sendStatus(400);
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: user_id } });

      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    } catch {
      res.sendStatus(500);
    } finally {
      await prisma.$disconnect();
    }
  };

  static delete: RequestHandler = async (req, res) => {
    try {
      await prisma.$connect();

      await prisma.user.delete({ where: { id: +req.params.id } });

      res.sendStatus(204);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === PrismaErrorCodes.NotFound) {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    } finally {
      await prisma.$disconnect();
    }
  };
}
