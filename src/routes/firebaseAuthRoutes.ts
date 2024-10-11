import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword
} from '../controllers/firebaseAuthController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/reset-password', resetPassword);

export default router;
