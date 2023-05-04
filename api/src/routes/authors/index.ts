import { Router } from 'express';

import { AuthorController } from './controller';

const router = Router();

router.get('/', AuthorController.read);

router.post('/', AuthorController.create);

export default router;
