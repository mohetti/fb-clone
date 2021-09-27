import { RequestHandler } from 'express';
import Message from '../models/newMessage';
import User from '../models/newUser';
import { UserInterface } from '../interfaces/userInterface';

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
  Message.findOneAndDelete({ _id: req.body.deleteMessage }, { new: true }).then(
    (response) => {
      return res.json({ status: 200 });
    }
  );
};

export const updateMessage: RequestHandler = (req, res, next) => {
  Message.findOneAndUpdate(
    { _id: req.body.id },
    { message: req.body.message },
    { new: true }
  ).then((response) => {
    return res.json({ status: 200 });
  });
};

export const getMessages: RequestHandler = (req, res, next) => {
  const skip = +req.query.count!;
  console.log(skip);

  User.findOne({ _id: req.session.user!._id }).then((response: any) => {
    const messageHolders = Array.from(response.friends);
    messageHolders.push(req.session.user!._id);
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
      .limit(skip)
      .exec((err, docs) => {
        if (err) return next(err);
        return res.json({ status: 200, docs: docs });
      });
  });
};

export const addComment: RequestHandler = (req, res, next) => {
  const comment = {
    user: {
      firstName: req.session.user?.firstName,
      surName: req.session.user?.surName,
      img: req.session.user?.img,
    },
    comment: req.body.msg,
  };
  Message.findOneAndUpdate(
    {
      _id: req.body.msgId,
    },
    { $push: { comments: comment } },
    { new: true }
  ).then((response) => {
    console.log(response);
    return res.json({ status: 200, docs: response });
  });
};
