import { Router } from 'express';
import {
  createMessage,
  deleteMessage,
  updateMessage,
  getMessages,
} from '../controllers/messages';
import isAuth from '../util/is-auth';

const router = Router();

// create new message
router.post('/create', isAuth, createMessage);

// delete message
router.put('/delete', isAuth, deleteMessage);

// get messages from user and friends
router.get('/', isAuth, getMessages);

// edit message id from user
router.put('/edit', isAuth, updateMessage);

export default router;
