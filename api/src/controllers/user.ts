import { RequestHandler } from 'express';
import User from '../models/newUser';
import Message from '../models/newMessage';

export const getProfile: RequestHandler = (req, res, next) => {
  User.findOne({ _id: req.body.id })
    .select('firstName surName img bio')
    .then((response) => {
      return res.json({ status: 200, docs: response });
    });
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

export const uploadImage: RequestHandler = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.session.user!._id },
    { img: req.file?.filename },
    { new: true }
  ).then((response) => {
    return res.json({ status: 200, docs: response });
  });
};

export const updateBio: RequestHandler = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.session.user!._id },
    { bio: req.body.bio },
    { new: true }
  ).then((response) => {
    res.json({ status: 200 });
  });
};

export const firstLogin: RequestHandler = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.session.user!._id },
    { firstLogin: false },
    { new: true }
  ).then((response) => {
    res.json({ status: 200 });
  });
};
