"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFriend = exports.sendFriendResponse = exports.sendFriendRequest = exports.getFriends = void 0;
const getFriends = (req, res, next) => {
    console.log('Get Friends');
    res.send('Get Friends');
};
exports.getFriends = getFriends;
const sendFriendRequest = (req, res, next) => {
    console.log('Friend Request');
    res.send('Friend Request');
};
exports.sendFriendRequest = sendFriendRequest;
const sendFriendResponse = (req, res, next) => {
    console.log('Friend Response');
    res.send('Friend Response');
};
exports.sendFriendResponse = sendFriendResponse;
const deleteFriend = (req, res, next) => {
    console.log('Delete Friend');
    res.send('Delete Friend');
};
exports.deleteFriend = deleteFriend;
