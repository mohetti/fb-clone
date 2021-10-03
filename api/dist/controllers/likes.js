"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.updateMessage = exports.createLikeInstance = void 0;
const newMessage_1 = __importDefault(require("../models/newMessage"));
const createLikeInstance = (req, res, next) => {
    console.log('Create Like Instance');
    res.send('Create Like Instance');
};
exports.createLikeInstance = createLikeInstance;
const updateMessage = (req, res, next) => {
    newMessage_1.default.findOne({ _id: req.body.likedMessage })
        .then((response) => {
        if (response.likes.indexOf(req.session.user._id) !== -1) {
            return newMessage_1.default.findOneAndUpdate({ _id: req.body.likedMessage }, { $pull: { likes: req.session.user._id } });
        }
        return newMessage_1.default.findOneAndUpdate({ _id: req.body.likedMessage }, { $push: { likes: req.session.user._id } });
    })
        .then((response) => {
        return res.json({ status: 200, docs: response });
    })
        .catch((err) => {
        return next(err);
    });
};
exports.updateMessage = updateMessage;
const updateComment = (req, res, next) => {
    console.log('Update Comment');
    res.send('Update Comment');
};
exports.updateComment = updateComment;
