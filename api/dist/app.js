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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const messages_1 = __importDefault(require("./routes/messages"));
const friends_1 = __importDefault(require("./routes/friends"));
const comments_1 = __importDefault(require("./routes/comments"));
const comments_2 = __importDefault(require("./routes/comments"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
dotenv.config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luzem.mongodb.net/fb_clone?retryWrites=true&w=majority`;
mongoose_1.default.connect(mongoDB, {});
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('connected to mongodb');
});
// passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/auth', auth_1.default);
app.use('/user', user_1.default);
app.use('/messages', messages_1.default);
app.use('/friends', friends_1.default);
app.use('/comments', comments_1.default);
app.use('/likes', comments_2.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.listen(5000, () => {
    console.log('Server running');
});
