import { Router } from 'express';

import { checkAuth } from '../../middleware/checkAuth';
import { UserController } from './controller';

const router = Router();

router.post('/', UserController.create);

router.get('/me', checkAuth, UserController.getById);

export default router;
