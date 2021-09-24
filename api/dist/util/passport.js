"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const newUser_1 = __importDefault(require("../models/newUser"));
const passport_local_1 = __importDefault(require("passport-local"));
passport_1.default.use(new passport_local_1.default.Strategy((email, password, done) => {
    newUser_1.default.findOne({ email: email }, (err, user) => {
        if (err)
            return done(err);
        if (!user)
            return done(null, false, { message: 'Incorrect username' });
        if (user.password !== password)
            return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    });
}));
