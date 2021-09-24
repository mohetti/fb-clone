import { RequestHandler } from 'express';
import User from '../models/newUser';
import Message from '../models/newMessage';

export const getProfile: RequestHandler = (req, res, next) => {
  console.log('Get Profile');
  res.send('Get Profile');
};

export const deleteProfile: RequestHandler = (req, res, next) => {
  User.findOneAndDelete({ _id: req.session.user?._id })
    .then((response) => {
      return Message.deleteMany({ user: req.session.user?._id });
    })
    .then((response) => {
      return res.json({ status: 200, msg: 'Profile deleted' });
    })
    .catch((err) => {
      return next(err);
    });
};

export const updateProfile: RequestHandler = (req, res, next) => {
  console.log('Update Profile');
  res.send('Update Profile');
};
