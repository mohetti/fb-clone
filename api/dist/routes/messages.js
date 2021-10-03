"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_1 = require("../controllers/messages");
const is_auth_1 = __importDefault(require("../util/is-auth"));
const router = (0, express_1.Router)();
router.post('/create', is_auth_1.default, messages_1.createMessage);
router.put('/delete', is_auth_1.default, messages_1.deleteMessage);
router.get('/', is_auth_1.default, messages_1.getMessages);
router.put('/edit', is_auth_1.default, messages_1.updateMessage);
router.put('/comment', is_auth_1.default, messages_1.addComment);
router.post('/', is_auth_1.default, messages_1.getMsgsFromOthers);
exports.default = router;
