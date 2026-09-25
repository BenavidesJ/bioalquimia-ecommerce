import { Router } from 'express';
import catalogRoutes from './catalog.routes';
import healthRoutes from './health.routes';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/catalog', catalogRoutes);

export default router;
