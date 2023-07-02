import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth';

import { AuthorController } from './AuthorController';

const router = Router();

router.post('/', authMiddleware(), AuthorController.create);

router.get('/', authMiddleware(), AuthorController.findMany);

export default router;
