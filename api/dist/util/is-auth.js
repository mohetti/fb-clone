"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.json({ status: 401 });
    }
    return next();
};
exports.default = isAuth;
