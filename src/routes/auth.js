import express from 'express';
import {
  registration,
  login,
  protectedToken,
} from '../controllers/authController.js';

const authRouter = express.Router();

// Registration/login/protected
authRouter.post('/registration', registration);
authRouter.post('/login', login);
authRouter.get('/protected', protectedToken);

export default authRouter;
