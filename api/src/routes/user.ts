import { Router } from 'express';
import { getProfile, deleteProfile, updateProfile } from '../controllers/user';
import isAuth from '../util/is-auth';
import User from '../models/newUser';

// image upload
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = Router();

// upload image
router.post('/upload', upload.single('profileImage'), (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.session.user!._id },
    { img: req.file?.filename },
    { new: true }
  ).then((response) => {
    return res.json({ status: 200, docs: response });
  });
});

// get profile of user / other user
router.get('/:id', isAuth, getProfile);

// delete own profile
router.post('/delete', isAuth, deleteProfile);

// update profile
router.put('/:id', isAuth, updateProfile);

export default router;
