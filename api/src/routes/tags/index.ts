import { Router } from 'express';

import { TagController } from './TagController';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

router.get('/', TagController.getAll);

router.get('/:id', TagController.getById);

router.post('/', checkAuth, TagController.create);

export default router;
