import passport from 'passport';
import passportLocal from 'passport-local';
import passportFacebook from 'passport-facebook';
import { NativeError } from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../models/newUser';
import { UserInterface } from '../interfaces/userInterface';

import * as dotenv from 'dotenv';
dotenv.config();

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser((_id, done) => {
  User.findById(_id, (err: NativeError, user: UserInterface) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err: NativeError, user: UserInterface) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(undefined, false, { message: 'Wrong email' });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(undefined, user);
        }
        return done(undefined, false, { message: 'Incorrect password' });
      });
    });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
      callbackURL: 'http://localhost:5000/auth/login/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne(
        { facebook: accessToken },
        function (err: Error, user: UserInterface) {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, user);
          }

          User.findOneAndUpdate(
            { email: profile.emails![0].value },
            {
              $set: {
                facebook: accessToken,
              },
            },
            { new: true }
          ).then((updatedUser) => {
            if (err) {
              return done(err);
            }
            if (!updatedUser) {
              const newUser = new User({
                firstName: profile.name?.givenName,
                surName: profile.name?.familyName,
                email: profile.emails![0].value,
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
        }
      );
    }
  )
);
