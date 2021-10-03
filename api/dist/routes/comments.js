"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_1 = require("../controllers/comments");
const is_auth_1 = __importDefault(require("../util/is-auth"));
const router = (0, express_1.Router)();
// create new comment | :id belongs to message that comment is attached
router.post('/create', is_auth_1.default, comments_1.createComment);
// delete comment
router.delete('/delete', is_auth_1.default, comments_1.deleteComment);
// edit message id from user
router.put('/edit', is_auth_1.default, comments_1.updateComment);
exports.default = router;
