import { Router } from 'express';

import { checkAuth } from '../../middleware/checkAuth';
import { CategoryController } from './CategoryController';

const router = Router();

router.post('/', checkAuth, CategoryController.create);

router.get('/', CategoryController.findMany);

router.get('/:id', CategoryController.findOne);

router.patch('/:id', checkAuth, CategoryController.update);

export default router;
