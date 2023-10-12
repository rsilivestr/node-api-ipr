import { RequestHandler } from 'express';

import { prisma } from '@/prisma';

export class CommentController {
  static create: RequestHandler = async (req, res) => {
    try {
      const {
        auth: { user_id },
        body,
        post_id,
      } = req.body;

      if (!user_id || !body || !post_id) {
        res.sendStatus(400);
        return;
      }

      const createdComment = await prisma.comment.create({
        data: {
          body,
          post_id,
          user_id,
        },
      });
      if (createdComment) {
        res.status(201).send(createdComment);
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(500);
    }
  };

  static findMany: RequestHandler = async (req, res) => {
    try {
      const { post_id, limit = '5', offset = '0' } = req.query;

      if (!post_id) {
        res.sendStatus(400);
        return;
      }

      const comments = await prisma.comment.findMany({
        include: {
          created_by: {
            select: {
              avatar: true,
              name: true,
              surname: true,
            },
          },
        },
        where: { post_id: +post_id },
        orderBy: {
          created_at: 'desc',
        },
        take: +limit,
        skip: +offset,
      });
      res.send(comments);
    } catch {
      res.sendStatus(500);
    }
  };

  static delete: RequestHandler = async (req, res) => {
    try {
      const { auth } = req.body;
      const id = +req.params.id;

      const comment = await prisma.comment.findUnique({ where: { id } });

      if (!comment) {
        res.sendStatus(404);
        return;
      }

      const isAuthorized = auth.user_id === comment.user_id || auth.is_admin;

      if (!isAuthorized) {
        res.sendStatus(403);
        return;
      }

      await prisma.comment.delete({ where: { id } });
      res.sendStatus(204);
    } catch {
      res.sendStatus(500);
    }
  };
}
