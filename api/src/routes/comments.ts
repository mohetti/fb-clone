import { Router } from 'express';
import {
  createComment,
  deleteComment,
  updateComment,
} from '../controllers/comments';

import isAuth from '../util/is-auth';

const router = Router();

// create new comment | :id belongs to message that comment is attached
router.post('/create', isAuth, createComment);

// delete comment
router.delete('/delete', isAuth, deleteComment);

// edit message id from user
router.put('/edit', isAuth, updateComment);

export default router;
