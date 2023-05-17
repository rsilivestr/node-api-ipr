import { Router } from 'express';

import { UserController } from './controller';

const router = Router();

router.post('/', UserController.create);

router.get('/', UserController.findMany);

router.get('/:id', UserController.findOne);


export default router;
