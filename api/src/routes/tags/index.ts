import { Router } from 'express';

import { checkAuth } from '../../middleware/checkAuth';
import { TagController } from './TagController';

const router = Router();

router.post('/', checkAuth, TagController.create);

router.get('/', TagController.getAll);

router.get('/:id', TagController.getById);

router.patch('/:id', checkAuth, TagController.update);

router.delete('/:id', checkAuth, TagController.delete);

export default router;
