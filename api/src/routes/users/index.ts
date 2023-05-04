import { Router } from 'express';

import { UserController } from './controller';

const router = Router();

router.get('/', UserController.read);
router.get('/:id', UserController.findById);

router.post('/', UserController.create);

export default router;
