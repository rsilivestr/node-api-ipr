import { Router } from 'express';

import { PostController } from './controller';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

router.get('/', PostController.read);

router.post('/', checkAuth, PostController.create);

export default router;
