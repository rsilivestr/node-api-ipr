import { Router } from 'express';

import { CategoryController } from './controller';

const router = Router();

router.get('/', CategoryController.read);

router.post('/', CategoryController.create);

export default router;
