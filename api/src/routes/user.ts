import { Router } from 'express';
import { getProfile, deleteProfile, updateProfile } from '../controllers/user';
import isAuth from '../util/is-auth';

const router = Router();

// get profile of user / other user
router.get('/:id', isAuth, getProfile);

// delete own profile
router.post('/delete', isAuth, deleteProfile);

// update profile
router.put('/:id', isAuth, updateProfile);

export default router;
