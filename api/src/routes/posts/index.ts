import { Router } from 'express';

import { authMiddleware } from 'middleware/auth';

import { PostController } from './controller';

const router = Router();

router.get('/', PostController.findMany);
router.get('/:id', PostController.findById);

router.post('/', authMiddleware(), PostController.create);

export default router;
