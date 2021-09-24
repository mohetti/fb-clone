"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.updateMessage = exports.createLikeInstance = void 0;
const createLikeInstance = (req, res, next) => {
    console.log('Create Like Instance');
    res.send('Create Like Instance');
};
exports.createLikeInstance = createLikeInstance;
const updateMessage = (req, res, next) => {
    console.log('Update Message');
    res.send('Update Message');
};
exports.updateMessage = updateMessage;
const updateComment = (req, res, next) => {
    console.log('Update Comment');
    res.send('Update Comment');
};
exports.updateComment = updateComment;
