import { Router } from 'express';

import { TagsController } from './controller';

const router = Router();

router.get('/', TagsController.read);

router.post('/', TagsController.create);

export default router;
