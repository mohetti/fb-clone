"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
// get profile of user / other user
router.get('/:id', user_1.getProfile);
// delete own profile
router.delete('/:id', user_1.deleteProfile);
// update profile
router.put('/:id', user_1.updateProfile);
exports.default = router;
