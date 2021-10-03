"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const newUser_1 = __importDefault(require("../models/newUser"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const LocalStrategy = passport_local_1.default.Strategy;
const FacebookStrategy = passport_facebook_1.default.Strategy;
passport_1.default.serializeUser((req, user, done) => {
    done(undefined, user);
});
passport_1.default.deserializeUser((_id, done) => {
    newUser_1.default.findById(_id, (err, user) => {
        done(err, user);
    });
});
passport_1.default.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    newUser_1.default.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(undefined, false, { message: 'Wrong email' });
        }
        bcryptjs_1.default.compare(password, user.password, (err, res) => {
            if (res) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: 'Incorrect password' });
        });
    });
}));
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:5000/auth/login/facebook/callback',
    profileFields: ['id', 'emails', 'name'],
}, function (accessToken, refreshToken, profile, done) {
    newUser_1.default.findOne({ facebook: accessToken }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, user);
        }
        newUser_1.default.findOneAndUpdate({ email: profile.emails[0].value }, {
            $set: {
                facebook: accessToken,
            },
        }, { new: true }).then((updatedUser) => {
            var _a, _b;
            if (err) {
                return done(err);
            }
            if (!updatedUser) {
                const newUser = new newUser_1.default({
                    firstName: (_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName,
                    surName: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName,
                    email: profile.emails[0].value,
                    facebook: accessToken,
                    img: '5baa1ddad1b11e01af1f2243390dc974',
                    bio: '',
                    firstLogin: true,
                });
                newUser.save();
                return done(null, newUser);
            }
            return done(null, updatedUser);
        });
    });
}));
