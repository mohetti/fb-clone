import { Router } from 'express';
import {
  login,
  signup,
  logout,
  checkAuth,
  loginFb,
  loginFbCallback,
} from '../controllers/auth';

const router = Router();

router.post('/login', login);

router.get('/logout', logout);

router.post('/signup', signup);

router.get('/checkauth', checkAuth);

router.get('/login/facebook', loginFb);

router.get('/login/facebook/callback', loginFbCallback);

export default router;
