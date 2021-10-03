"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstLogin = exports.updateBio = exports.uploadImage = exports.updateProfile = exports.deleteProfile = exports.getProfile = void 0;
const newUser_1 = __importDefault(require("../models/newUser"));
const newMessage_1 = __importDefault(require("../models/newMessage"));
const getProfile = (req, res, next) => {
    newUser_1.default.findOne({ _id: req.body.id })
        .select('firstName surName img bio')
        .then((response) => {
        return res.json({ status: 200, docs: response });
    });
};
exports.getProfile = getProfile;
const deleteProfile = (req, res, next) => {
    var _a;
    newUser_1.default.findOneAndDelete({ _id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id })
        .then((response) => {
        var _a;
        return newMessage_1.default.deleteMany({ user: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id });
    })
        .then((response) => {
        return res.json({ status: 200, msg: 'Profile deleted' });
    })
        .catch((err) => {
        return next(err);
    });
};
exports.deleteProfile = deleteProfile;
const updateProfile = (req, res, next) => {
    console.log('Update Profile');
    res.send('Update Profile');
};
exports.updateProfile = updateProfile;
const uploadImage = (req, res, next) => {
    var _a;
    newUser_1.default.findOneAndUpdate({ _id: req.session.user._id }, { img: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename }, { new: true }).then((response) => {
        return res.json({ status: 200, docs: response });
    });
};
exports.uploadImage = uploadImage;
const updateBio = (req, res, next) => {
    newUser_1.default.findOneAndUpdate({ _id: req.session.user._id }, { bio: req.body.bio }, { new: true }).then((response) => {
        res.json({ status: 200 });
    });
};
exports.updateBio = updateBio;
const firstLogin = (req, res, next) => {
    newUser_1.default.findOneAndUpdate({ _id: req.session.user._id }, { firstLogin: false }, { new: true }).then((response) => {
        res.json({ status: 200 });
    });
};
exports.firstLogin = firstLogin;
