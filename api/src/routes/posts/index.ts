import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth';

import { PostController } from './PostController';

const router = Router();

router.post('/', authMiddleware({ allowUser: true }), PostController.create);

router.get('/', PostController.findMany);

router.get('/:id', PostController.findOne);

export default router;
