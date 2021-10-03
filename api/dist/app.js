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
exports.csrfProtection = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const messages_1 = __importDefault(require("./routes/messages"));
const friends_1 = __importDefault(require("./routes/friends"));
const comments_1 = __importDefault(require("./routes/comments"));
const likes_1 = __importDefault(require("./routes/likes"));
const newUser_1 = __importDefault(require("./models/newUser"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const csurf_1 = __importDefault(require("csurf"));
exports.csrfProtection = (0, csurf_1.default)({ cookie: true });
const app = (0, express_1.default)();
dotenv.config();
const MongoStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoStore({
    uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luzem.mongodb.net/fb_clone?retryWrites=true&w=majority`,
    collection: 'session',
});
app.use(express_1.default.static('uploads'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use((0, express_session_1.default)({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        httpOnly: true,
    },
}));
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    newUser_1.default.findById(req.session.user._id)
        .then((user) => {
        req.user = user;
        return next();
    })
        .catch((err) => {
        return next(err);
    });
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luzem.mongodb.net/fb_clone?retryWrites=true&w=majority`;
mongoose_1.default.connect(mongoDB, {});
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('connected to mongodb');
    console.log('does this get printed too');
});
app.get('/token', exports.csrfProtection, function (req, res) {
    res.send({ csrfToken: req.csrfToken() });
});
app.use('/auth', exports.csrfProtection, auth_1.default);
app.use('/user', exports.csrfProtection, user_1.default);
app.use('/messages', exports.csrfProtection, messages_1.default);
app.use('/friends', exports.csrfProtection, friends_1.default);
app.use('/comments', exports.csrfProtection, comments_1.default);
app.use('/likes', exports.csrfProtection, likes_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.use(express_1.default.static('client/build'));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, 'client', 'build', 'index.html'));
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log('listening on port' + port);
});
let test = 'test';
