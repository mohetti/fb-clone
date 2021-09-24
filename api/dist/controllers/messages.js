"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.updateMessage = exports.deleteMessage = exports.createMessage = void 0;
const createMessage = (req, res, next) => {
    console.log('Create Message');
    res.send('Create Message');
};
exports.createMessage = createMessage;
const deleteMessage = (req, res, next) => {
    console.log('Delete Message');
    res.send('Delete Message');
};
exports.deleteMessage = deleteMessage;
const updateMessage = (req, res, next) => {
    console.log('Update Message');
    res.send('Update Message');
};
exports.updateMessage = updateMessage;
const getMessages = (req, res, next) => {
    console.log('Get Messages');
    res.send('Get Messages');
};
exports.getMessages = getMessages;
