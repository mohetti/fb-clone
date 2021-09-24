"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likes_1 = require("../controllers/likes");
const router = (0, express_1.Router)();
// create new instance in likes
router.post('/create', likes_1.createLikeInstance);
// like/unlike a message user is own, id is message id
router.put('messages/:user/:id', likes_1.updateMessage);
// like/unlike a comment user is own, id is comment id
router.put('comments/:user/:id', likes_1.updateComment);
exports.default = router;
