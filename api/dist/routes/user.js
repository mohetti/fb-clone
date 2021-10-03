"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const is_auth_1 = __importDefault(require("../util/is-auth"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = (0, express_1.Router)();
router.post('/upload', is_auth_1.default, upload.single('profileImage'), user_1.uploadImage);
router.post('/', is_auth_1.default, user_1.getProfile);
router.post('/delete', is_auth_1.default, user_1.deleteProfile);
router.put('/', is_auth_1.default, user_1.updateProfile);
router.post('/bio', is_auth_1.default, user_1.updateBio);
router.post('/firstlogin', is_auth_1.default, user_1.firstLogin);
exports.default = router;
