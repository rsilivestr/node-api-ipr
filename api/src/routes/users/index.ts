import { Router } from 'express';

import { checkAuth } from '../../middleware/checkAuth';
import { UserController } from './UserController';

const router = Router();

router.post('/', UserController.create);

router.get('/me', checkAuth, UserController.getById);

router.delete('/:id', checkAuth, UserController.delete);

export default router;
