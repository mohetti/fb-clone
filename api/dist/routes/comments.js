"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_1 = require("../controllers/comments");
const router = (0, express_1.Router)();
// create new comment | :id belongs to message that comment is attached
router.post('/create/:user/:id', comments_1.createComment);
// delete comment
router.delete('/:user/:id', comments_1.deleteComment);
// edit message id from user
router.put('/:user/:id', comments_1.updateComment);
exports.default = router;
