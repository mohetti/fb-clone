import express, { Request, Response, NextFunction } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import messagesRoutes from './routes/messages';
import friendsRoutes from './routes/friends';
import commentsRoutes from './routes/comments';
import likesRoutes from './routes/likes';
import passport from 'passport';
import * as passportConfig from './util/passport';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import { UserInterface } from './interfaces/userInterface';
import User from './models/newUser';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

export const csrfProtection = csrf({ cookie: true });

const app = express();
dotenv.config();

const MongoStore = MongoDBStore(session);
const store = new MongoStore({
  uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luzem.mongodb.net/fb_clone?retryWrites=true&w=majority`,
  collection: 'session',
});

declare module 'express-session' {
  export interface SessionData {
    isLoggedIn: boolean;
    user: UserInterface;
  }
}

app.use(express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded());
app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
    },
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user!._id)
    .then((user) => {
      req.user = user!;
      return next();
    })
    .catch((err: Error) => {
      return next(err);
    });
});

app.use(passport.initialize());
app.use(passport.session());

const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luzem.mongodb.net/fb_clone?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('connected to mongodb');
});

// following as blueprint for csrfToken
app.use(cookieParser());
app.get('/form', csrfProtection, function (req, res) {
  res.send({ csrfToken: req.csrfToken() });
});
app.post('/process', csrfProtection, function (req, res) {
  res.json({ status: 200, msg: 'data is being processed' });
});
app.use('/auth', csrfProtection, authRoutes);
app.use('/user', csrfProtection, userRoutes);
app.use('/messages', csrfProtection, messagesRoutes);
app.use('/friends', csrfProtection, friendsRoutes);
app.use('/comments', csrfProtection, commentsRoutes);
app.use('/likes', csrfProtection, likesRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(5000, () => {
  console.log('Server running');
});
