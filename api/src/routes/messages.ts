import { Router } from 'express';
import {
  createMessage,
  deleteMessage,
  updateMessage,
  getMessages,
  addComment,
} from '../controllers/messages';

import isAuth from '../util/is-auth';

const router = Router();

router.post('/create', isAuth, createMessage);

router.put('/delete', isAuth, deleteMessage);

router.get('/', isAuth, getMessages);

router.put('/edit', isAuth, updateMessage);

router.put('/comment', isAuth, addComment);

export default router;
