"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friends_1 = require("../controllers/friends");
const router = (0, express_1.Router)();
// get friends list
router.get('/:id', friends_1.getFriends);
// send request to user | :id is from logged in user
router.put('/request/:id', friends_1.sendFriendRequest);
// send response to user | :id is from other user
router.put('/response/:id', friends_1.sendFriendResponse);
// delete Friend
router.put('/:id/:friend/delete', friends_1.deleteFriend);
exports.default = router;
