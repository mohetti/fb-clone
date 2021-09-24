import { RequestHandler } from 'express';
import Message from '../models/newMessage';
import User from '../models/newUser';

export const createMessage: RequestHandler = async (req, res, next) => {
  try {
    const newMessage = await new Message({
      message: req.body.message,
      user: req.session.user!._id,
    });
    newMessage.save();
    return res.json({ status: 200, msg: 'Message created' });
  } catch (err) {
    return res.json({ status: 400, msg: 'Something went wrong' });
  }
};

export const deleteMessage: RequestHandler = (req, res, next) => {
  Message.findOneAndDelete({ _id: req.body.deleteMessage }).then((response) => {
    return res.json({ status: 200 });
  });
};

export const updateMessage: RequestHandler = (req, res, next) => {
  Message.findOneAndUpdate(
    { _id: req.body.id },
    { message: req.body.message }
  ).then((response) => {
    return res.json({ status: 200 });
  });
};

export const getMessages: RequestHandler = (req, res, next) => {
  const count = +req.query.count!;
  const skip = +req.query.skip!;

  User.findOne({ _id: req.session.user!._id }).then((response: any) => {
    console.log(response);
    const messageHolders = Array.from(response.friends);
    messageHolders.push(req.session.user!._id);
    console.log(messageHolders);
    Message.find({
      user: { $in: messageHolders },
    })
      .populate({
        path: 'user',
        model: 'User',
        select: {
          password: 0,
          friends: 0,
          friendsRequest: 0,
          email: 0,
          facebook: 0,
        },
      })
      .sort({ time: -1 })
      .skip(skip)
      .limit(count)
      .exec((err, docs) => {
        if (err) return next(err);
        return res.json({ status: 200, docs: docs });
      });
  });
};
