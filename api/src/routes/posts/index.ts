import { Router } from 'express';

import { PostController } from './controller';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

router.get('/', PostController.findMany);
router.get('/:id', PostController.findById);

router.post('/', checkAuth, PostController.create);

export default router;
