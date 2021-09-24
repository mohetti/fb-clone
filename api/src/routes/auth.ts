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

// login user
router.post('/login', login);

// logout user
router.get('/logout', logout);

// create new user
router.post('/signup', signup);

router.get('/checkauth', checkAuth);

router.get('/login/facebook', loginFb);

router.get('/login/facebook/callback', loginFbCallback);
export default router;
