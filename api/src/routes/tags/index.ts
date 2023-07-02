import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth';

import { TagController } from './TagController';

const router = Router();

router.post('/', authMiddleware(), TagController.create);

router.get('/', TagController.getAll);

router.get('/:id', TagController.getById);

router.patch('/:id', authMiddleware(), TagController.update);

router.delete('/:id', authMiddleware(), TagController.delete);

export default router;
