import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth';

import { TagController } from './TagController';

const router = Router();

router.post('/', authMiddleware(), TagController.create);

router.get('/', TagController.findMany);

router.get('/:id', TagController.findOne);

router.patch('/:id', authMiddleware(), TagController.update);

router.delete('/:id', authMiddleware(), TagController.delete);

export default router;
