import { RequestHandler } from 'express';
import User from '../models/newUser';

export const getFriends: RequestHandler = (req, res, next) => {
  console.log('Get Friends');
  res.send('Get Friends');
};

export const sendFriendRequest: RequestHandler = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { $push: { friendsRequest: req.session.user!._id } }
  )
    .then((response) => {
      return res.json({ status: 200, msg: response });
    })
    .catch((err) => {
      return next(err);
    });
};

export const sendFriendResponse: RequestHandler = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $push: { friends: req.session.user!._id },
    }
  )
    .then((response) => {
      return User.findOneAndUpdate(
        { _id: req.session.user!._id },
        {
          $push: { friends: req.body.id },
          $pull: { friendsRequest: req.body.id },
        },
        { new: true }
      );
    })
    .then((response) => {
      return res.json({ status: 200, docs: response });
    });
};

export const deleteFriend: RequestHandler = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $pull: { friends: req.session.user!._id },
    }
  )
    .then((response) => {
      return User.findOneAndUpdate(
        { _id: req.session.user!._id },
        {
          $pull: { friends: req.body.id },
        }
      );
    })
    .then((response) => {
      return res.json({ status: 200 });
    });
};

export const deleteFriendRequest: RequestHandler = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      $pull: { friendsRequest: req.session.user!._id },
    }
  ).then((response) => {
    return res.json({ status: 200 });
  });
};

export const getFriendSuggestions: RequestHandler = (req, res, next) => {
  User.find(
    { _id: { $ne: req.session.user!._id } },
    (err: Error, docs: any) => {
      if (err) return next(err);
      return res.json({ status: 200, docs: docs });
    }
  );
};
