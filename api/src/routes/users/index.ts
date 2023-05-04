import { Router } from 'express';

import { UserController } from './controller';

const router = Router();

router.get('/', UserController.getAll);
router.get('/:id', UserController.getOne)

router.post('/', UserController.create);

export default router;
