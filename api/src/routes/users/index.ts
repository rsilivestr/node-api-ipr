import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth';

import { UserController } from './UserController';

const router = Router();

router.post('/', UserController.create);

router.get('/me', authMiddleware({ allowUser: true }), UserController.getById);

router.delete('/:id', authMiddleware(), UserController.delete);

export default router;
