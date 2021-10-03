"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friends_1 = require("../controllers/friends");
const is_auth_1 = __importDefault(require("../util/is-auth"));
const router = (0, express_1.Router)();
// get friends list
router.get('/', is_auth_1.default, friends_1.getFriends);
router.get('/suggestions', is_auth_1.default, friends_1.getFriendSuggestions);
// send request to user | :id is from logged in user
router.put('/request', is_auth_1.default, friends_1.sendFriendRequest);
// send response to user | :id is from other user
router.put('/response', is_auth_1.default, friends_1.sendFriendResponse);
// delete Friend
router.put('/delete', is_auth_1.default, friends_1.deleteFriend);
// delete Friend Request
router.put('/delete/friendrequest', is_auth_1.default, friends_1.deleteFriendRequest);
exports.default = router;
