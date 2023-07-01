import { Router } from 'express';

import { AuthController } from './AuthController';

const router = Router();

router.post('/', AuthController.login);

// router.post('/refresh', AuthController.refresh);

export default router;
