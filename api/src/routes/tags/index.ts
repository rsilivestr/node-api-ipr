import { Router } from 'express';

import { TagController } from './TagController';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

router.post('/', checkAuth, TagController.create);

router.get('/', TagController.getAll);

router.get('/:id', TagController.getById);

router.patch('/:id', checkAuth, TagController.update);

export default router;
