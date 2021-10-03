"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendSuggestions = exports.deleteFriendRequest = exports.deleteFriend = exports.sendFriendResponse = exports.sendFriendRequest = exports.getFriends = void 0;
const newUser_1 = __importDefault(require("../models/newUser"));
const getFriends = (req, res, next) => {
    console.log('Get Friends');
    res.send('Get Friends');
};
exports.getFriends = getFriends;
const sendFriendRequest = (req, res, next) => {
    newUser_1.default.findOneAndUpdate({ _id: req.body.id }, { $push: { friendsRequest: req.session.user._id } })
        .then((response) => {
        return res.json({ status: 200, msg: response });
    })
        .catch((err) => {
        return next(err);
    });
};
exports.sendFriendRequest = sendFriendRequest;
const sendFriendResponse = (req, res, next) => {
    newUser_1.default.findOneAndUpdate({ _id: req.body.id }, {
        $push: { friends: req.session.user._id },
    })
        .then((response) => {
        return newUser_1.default.findOneAndUpdate({ _id: req.session.user._id }, {
            $push: { friends: req.body.id },
            $pull: { friendsRequest: req.body.id },
        }, { new: true });
    })
        .then((response) => {
        return res.json({ status: 200, docs: response });
    });
};
exports.sendFriendResponse = sendFriendResponse;
const deleteFriend = (req, res, next) => {
    newUser_1.default.findOneAndUpdate({ _id: req.body.id }, {
        $pull: { friends: req.session.user._id },
    })
        .then((response) => {
        return newUser_1.default.findOneAndUpdate({ _id: req.session.user._id }, {
            $pull: { friends: req.body.id },
        });
    })
        .then((response) => {
        return res.json({ status: 200 });
    });
};
exports.deleteFriend = deleteFriend;
const deleteFriendRequest = (req, res, next) => {
    newUser_1.default.findOneAndUpdate({ _id: req.body.id }, {
        $pull: { friendsRequest: req.session.user._id },
    }).then((response) => {
        return res.json({ status: 200 });
    });
};
exports.deleteFriendRequest = deleteFriendRequest;
const getFriendSuggestions = (req, res, next) => {
    newUser_1.default.find({ _id: { $ne: req.session.user._id } }, (err, docs) => {
        if (err)
            return next(err);
        return res.json({ status: 200, docs: docs });
    });
};
exports.getFriendSuggestions = getFriendSuggestions;
