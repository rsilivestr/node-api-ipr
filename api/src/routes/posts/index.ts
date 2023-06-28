import { Router } from 'express';

import { PostController } from './controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/', PostController.findMany);
router.get('/:id', PostController.findById);

router.post('/', authMiddleware(), PostController.create);

export default router;
