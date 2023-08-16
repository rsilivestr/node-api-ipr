import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth';

import { DraftController } from './DraftController';

const router = Router();

router.post('/', authMiddleware({ allowUser: true }), DraftController.create);

router.get('/', authMiddleware({ allowUser: true }), DraftController.findMany);

router.get('/:id', authMiddleware({ allowUser: true }), DraftController.findOne);

router.put('/:id', authMiddleware({ allowUser: true }), DraftController.update);

router.delete('/:id', authMiddleware({ allowUser: true }), DraftController.delete);

router.post('/:id/publish', authMiddleware({ allowUser: true }), DraftController.publish);

export default router;
