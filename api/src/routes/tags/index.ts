import { Router } from 'express';

import { TagController } from './controller';

const router = Router();

router.get('/', TagController.read);

router.post('/', TagController.create);

export default router;
