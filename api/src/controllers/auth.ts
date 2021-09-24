import { RequestHandler } from 'express';
import User from '../models/newUser';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import '../util/passport';
import { UserInterface } from '../interfaces/userInterface';

export const checkAuth: RequestHandler = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.json({ status: 401 });
  }

  return res.json({ status: 200, userInfo: req.user });
};

export const login: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (err: Error, user: UserInterface, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ status: 401, message: info.message });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    return res.json({ status: 200 });
  })(req, res, next);
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.json({ status: 200 });
  });
};

export const signup: RequestHandler = async (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    return res.json({
      status: 401,
      type: 'password',
      msg: 'Passwords do not match.',
    });
  }

  const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (!req.body.email.match(pattern)) {
    return res.json({
      status: 401,
      type: 'email',
      msg: 'Email has the wrong format.',
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  User.findOne(
    { email: req.body.email },
    async function (err: Error, user: UserInterface) {
      if (err) {
        return next(err);
      }
      if (user) {
        return res.json({
          status: 304,
          type: 'exists',
          msg: 'User already exists. Try to login.',
        });
      }
      const newUser = new User({
        firstName: req.body.firstName,
        surName: req.body.surName,
        email: req.body.email,
        password: hashedPassword,
        facebook: '',
        img: '',
      });
      await newUser.save();
      return res.json({
        status: 304,
        type: 'success',
        msg: 'Account created. Please login.',
      });
    }
  );
};

export const loginFb: RequestHandler = (req, res, next) => {
  passport.authenticate('facebook', { scope: ['email'] }, (err, user) => {})(
    req,
    res,
    next
  );
};

export const loginFbCallback: RequestHandler = (req, res, next) => {
  passport.authenticate('facebook', (err, user) => {
    if (err) return next(err);
    if (user) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return res.redirect('http://localhost:3000/feed');
    }
    return res.redirect('http://localhost:3000/login');
  })(req, res, next);
};
