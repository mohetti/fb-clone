"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
// login user
router.post('/login', auth_1.login);
// logout user
router.get('/logout', auth_1.logout);
// create new user
router.post('/signup', auth_1.signup);
exports.default = router;
