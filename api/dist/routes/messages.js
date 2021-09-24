"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_1 = require("../controllers/messages");
const router = (0, express_1.Router)();
// create new message
router.post('/create', messages_1.createMessage);
// delete message
router.delete('/:user/:id', messages_1.deleteMessage);
// get messages from user and friends
router.get('/:user', messages_1.getMessages);
// edit message id from user
router.put('/:user/:id', messages_1.updateMessage);
exports.default = router;
