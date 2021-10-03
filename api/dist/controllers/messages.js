"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = exports.getMsgsFromOthers = exports.getMessages = exports.updateMessage = exports.deleteMessage = exports.createMessage = void 0;
const newMessage_1 = __importDefault(require("../models/newMessage"));
const newUser_1 = __importDefault(require("../models/newUser"));
const createMessage = async (req, res, next) => {
    try {
        const newMessage = await new newMessage_1.default({
            message: req.body.message,
            user: req.session.user._id,
        });
        newMessage.save();
        return res.json({ status: 200, msg: 'Message created' });
    }
    catch (err) {
        return res.json({ status: 400, msg: 'Something went wrong' });
    }
};
exports.createMessage = createMessage;
const deleteMessage = (req, res, next) => {
    newMessage_1.default.findOneAndDelete({ _id: req.body.deleteMessage }, { new: true }).then((response) => {
        return res.json({ status: 200 });
    });
};
exports.deleteMessage = deleteMessage;
const updateMessage = (req, res, next) => {
    newMessage_1.default.findOneAndUpdate({ _id: req.body.id }, { message: req.body.message }, { new: true }).then((response) => {
        return res.json({ status: 200 });
    });
};
exports.updateMessage = updateMessage;
const getMessages = (req, res, next) => {
    const skip = +req.query.count;
    newUser_1.default.findOne({ _id: req.session.user._id }).then((response) => {
        const messageHolders = Array.from(response.friends);
        messageHolders.push(req.session.user._id);
        newMessage_1.default.find({
            user: { $in: messageHolders },
        })
            .populate({
            path: 'user',
            model: 'User',
            select: {
                password: 0,
                friends: 0,
                friendsRequest: 0,
                email: 0,
                facebook: 0,
            },
        })
            .sort({ time: -1 })
            .limit(skip)
            .exec((err, docs) => {
            if (err)
                return next(err);
            return res.json({ status: 200, docs: docs });
        });
    });
};
exports.getMessages = getMessages;
const getMsgsFromOthers = (req, res, next) => {
    newMessage_1.default.find({ user: req.body.id })
        .populate({
        path: 'user',
        model: 'User',
        select: {
            password: 0,
            friends: 0,
            friendsRequest: 0,
            email: 0,
            facebook: 0,
        },
    })
        .sort({ time: -1 })
        .then((response) => {
        return res.json({ status: 200, docs: response });
    });
};
exports.getMsgsFromOthers = getMsgsFromOthers;
const addComment = (req, res, next) => {
    var _a, _b, _c, _d;
    const comment = {
        user: {
            firstName: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.firstName,
            surName: (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.surName,
            img: (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.img,
            id: (_d = req.session.user) === null || _d === void 0 ? void 0 : _d._id,
        },
        comment: req.body.msg,
    };
    newMessage_1.default.findOneAndUpdate({
        _id: req.body.msgId,
    }, { $push: { comments: comment } }, { new: true }).then((response) => {
        return res.json({ status: 200, docs: response });
    });
};
exports.addComment = addComment;
