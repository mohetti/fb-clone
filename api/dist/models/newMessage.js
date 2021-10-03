"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MessageSchema = new Schema({
    message: { type: String },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    time: { type: Date, default: Date.now },
    likes: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: 'User' },
    comments: { type: [Object] },
});
const newMessage = mongoose_1.default.model('Message', MessageSchema);
exports.default = newMessage;
