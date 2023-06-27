import { Router } from 'express';

import { checkAuth } from '../../middleware/checkAuth';
import { UserController } from './UserController';

const router = Router();

router.get('/me', checkAuth, UserController.getById);

router.post('/', UserController.create);

router.delete('/:id', checkAuth, UserController.delete);

export default router;
