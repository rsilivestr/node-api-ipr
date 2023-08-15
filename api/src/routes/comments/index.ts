import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth';

import { CommentController } from './CommentController';

const router = Router();

router.post('/', authMiddleware({ allowUser: true }), CommentController.create);

router.get('/', CommentController.findMany);

router.delete('/:id', authMiddleware({ allowUser: true }), CommentController.delete);

export default router;
