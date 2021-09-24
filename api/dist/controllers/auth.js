"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.logout = exports.login = void 0;
const newUser_1 = __importDefault(require("../models/newUser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const login = (req, res, next) => {
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err)
            return next(err);
        if (!user)
            return res.json({ success: false, message: 'Auth failed', status: 401 });
        return res.status(200).json({
            success: true,
        });
    });
};
exports.login = login;
const logout = (req, res, next) => {
    console.log('Logout');
    res.send('Logout');
};
exports.logout = logout;
const signup = (req, res, next) => {
    bcryptjs_1.default.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err)
            return next(err);
        const newUser = new newUser_1.default({
            firstName: req.body.firstName,
            surName: req.body.surName,
            email: req.body.email,
            password: hashedPassword,
        });
        newUser.save((err) => {
            if (err)
                return next(err);
            console.log('saved');
            return res.status(200).json({
                success: true,
            });
        });
    });
};
exports.signup = signup;
let test = 'test';
