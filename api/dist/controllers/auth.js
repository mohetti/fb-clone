"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginFbCallback = exports.loginFb = exports.signup = exports.logout = exports.login = exports.checkAuth = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
require("../util/passport");
const newUser_1 = __importDefault(require("../models/newUser"));
const checkAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.json({ status: 401 });
    }
    return res.json({ status: 200, userInfo: req.user });
};
exports.checkAuth = checkAuth;
const login = (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({ status: 401, message: info.message });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        return res.json({ status: 200 });
    })(req, res, next);
};
exports.login = login;
const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err)
            return next(err);
        res.json({ status: 200 });
    });
};
exports.logout = logout;
const signup = async (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
        return res.json({
            status: 401,
            type: 'password',
            msg: 'Passwords do not match.',
        });
    }
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!req.body.email.match(pattern)) {
        return res.json({
            status: 401,
            type: 'email',
            msg: 'Email has the wrong format.',
        });
    }
    const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
    newUser_1.default.findOne({ email: req.body.email }, async function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            return res.json({
                status: 304,
                type: 'exists',
                msg: 'User already exists. Try to login.',
            });
        }
        const newUser = new newUser_1.default({
            firstName: req.body.firstName,
            surName: req.body.surName,
            email: req.body.email,
            password: hashedPassword,
            facebook: '',
            img: '5baa1ddad1b11e01af1f2243390dc974',
            bio: '',
            firstLogin: true,
        });
        await newUser.save();
        return res.json({
            status: 304,
            type: 'success',
            msg: 'Account created. Please login.',
        });
    });
};
exports.signup = signup;
const loginFb = (req, res, next) => {
    passport_1.default.authenticate('facebook', { scope: ['email'] }, (err, user) => { })(req, res, next);
};
exports.loginFb = loginFb;
const loginFbCallback = (req, res, next) => {
    passport_1.default.authenticate('facebook', (err, user) => {
        if (err)
            return next(err);
        if (user) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return res.redirect('http://localhost:3000/feed');
        }
        return res.redirect('http://localhost:3000/login');
    })(req, res, next);
};
exports.loginFbCallback = loginFbCallback;
