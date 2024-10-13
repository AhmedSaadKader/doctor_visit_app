import { Router } from 'express';
import firebaseRouter from './firebaseAuthRoutes';
import doctorsRouter from './doctorRoutes';
import swaggerRouter from './swagger';

const apiVersion = '/api/v1'; // Ensure consistent API version usage

const router = Router();

// Bundle all routers here
router.use(apiVersion + '/users', firebaseRouter);
router.use(apiVersion + '/doctors', doctorsRouter);
router.use(apiVersion + '/docs', swaggerRouter);

export default router;
