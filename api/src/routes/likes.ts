import { Router } from 'express';
import {
  createLikeInstance,
  updateMessage,
  updateComment,
} from '../controllers/likes';
import isAuth from '../util/is-auth';

const router = Router();

// create new instance in likes
router.post('/create', isAuth, createLikeInstance);

// like/unlike a message user is own, id is message id
router.put('/messages', isAuth, updateMessage);

// like/unlike a comment user is own, id is comment id
router.put('/comments', isAuth, updateComment);

export default router;
