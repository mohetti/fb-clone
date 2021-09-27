import { Router } from 'express';
import {
  getProfile,
  deleteProfile,
  updateProfile,
  uploadImage,
} from '../controllers/user';
import isAuth from '../util/is-auth';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/upload', isAuth, upload.single('profileImage'), uploadImage);

router.get('/', isAuth, getProfile);

router.post('/delete', isAuth, deleteProfile);

router.put('/', isAuth, updateProfile);

export default router;
