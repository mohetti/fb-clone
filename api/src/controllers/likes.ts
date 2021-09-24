import { RequestHandler } from 'express';
import Message from '../models/newMessage';

export const createLikeInstance: RequestHandler = (req, res, next) => {
  console.log('Create Like Instance');
  res.send('Create Like Instance');
};

export const updateMessage: RequestHandler = (req, res, next) => {
  Message.findOne({ _id: req.body.likedMessage })
    .then((response: any) => {
      if (response.likes.indexOf(req.session.user!._id) !== -1) {
        return Message.findOneAndUpdate(
          { _id: req.body.likedMessage },
          { $pull: { likes: req.session.user!._id } }
        );
      }
      return Message.findOneAndUpdate(
        { _id: req.body.likedMessage },
        { $push: { likes: req.session.user!._id } }
      );
    })
    .then((response) => {
      return res.json({ status: 200, docs: response });
    })
    .catch((err) => {
      return next(err);
    });
};

export const updateComment: RequestHandler = (req, res, next) => {
  console.log('Update Comment');
  res.send('Update Comment');
};
