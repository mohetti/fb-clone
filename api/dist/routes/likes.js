"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likes_1 = require("../controllers/likes");
const is_auth_1 = __importDefault(require("../util/is-auth"));
const router = (0, express_1.Router)();
// create new instance in likes
router.post('/create', is_auth_1.default, likes_1.createLikeInstance);
// like/unlike a message user is own, id is message id
router.put('/messages', is_auth_1.default, likes_1.updateMessage);
// like/unlike a comment user is own, id is comment id
router.put('/comments', is_auth_1.default, likes_1.updateComment);
exports.default = router;
