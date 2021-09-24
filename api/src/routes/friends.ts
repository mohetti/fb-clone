import { Router } from 'express';
import {
  getFriends,
  sendFriendRequest,
  sendFriendResponse,
  deleteFriend,
  getFriendSuggestions,
  deleteFriendRequest,
} from '../controllers/friends';
import isAuth from '../util/is-auth';

const router = Router();

// get friends list
router.get('/', isAuth, getFriends);
router.get('/suggestions', isAuth, getFriendSuggestions);

// send request to user | :id is from logged in user
router.put('/request', isAuth, sendFriendRequest);

// send response to user | :id is from other user
router.put('/response', isAuth, sendFriendResponse);

// delete Friend
router.put('/delete', isAuth, deleteFriend);

// delete Friend Request
router.put('/delete/friendrequest', isAuth, deleteFriendRequest);

export default router;
