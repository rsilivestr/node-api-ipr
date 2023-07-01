import { Router } from 'express';

import { authMiddleware } from 'middleware/auth';

import { CategoryController } from './CategoryController';

const router = Router();

router.post('/', authMiddleware(), CategoryController.create);

router.get('/', CategoryController.findMany);

router.get('/:id', CategoryController.findOne);

router.patch('/:id', authMiddleware(), CategoryController.update);

router.delete('/:id', authMiddleware(), CategoryController.delete);

export default router;
