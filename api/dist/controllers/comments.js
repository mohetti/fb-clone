"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.deleteComment = exports.createComment = void 0;
const createComment = (req, res, next) => {
    console.log('Create Comment');
    res.send('Create Comment');
};
exports.createComment = createComment;
const deleteComment = (req, res, next) => {
    console.log('Delete Comment');
    res.send('Delete Comment');
};
exports.deleteComment = deleteComment;
const updateComment = (req, res, next) => {
    console.log('Update Comment');
    res.send('Update Comment');
};
exports.updateComment = updateComment;
