import express from 'express';
import {
  registration,
  login,
  protectedToken,
  me,
} from '../controllers/authController.js';

import { requireAuth } from '../middleware/authMiddleware.js';
const authRouter = express.Router();

// Registration/login/protected
authRouter.post('/registration', registration);
authRouter.post('/login', login);
authRouter.get('/protected', protectedToken);
authRouter.get('/me', requireAuth, me);

export default authRouter;
