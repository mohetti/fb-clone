"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    firstName: { type: String, required: true, maxLength: 30 },
    surName: { type: String, required: true, maxLength: 30 },
    password: { type: String },
    email: { type: String, required: true, maxLength: 30 },
    friends: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    friendsRequest: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    facebook: { type: String, select: false },
    img: { type: String },
    bio: { type: String },
    firstLogin: { type: Boolean },
});
UserSchema.virtual('url').get(function () {
    return '/user/' + this._id;
});
const newUser = mongoose_1.default.model('User', UserSchema);
exports.default = newUser;
