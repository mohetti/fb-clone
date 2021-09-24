import { RequestHandler } from 'express';

export const createComment: RequestHandler = (req, res, next) => {
  console.log('Create Comment');
  res.send('Create Comment');
};

export const deleteComment: RequestHandler = (req, res, next) => {
  console.log('Delete Comment');
  res.send('Delete Comment');
};

export const updateComment: RequestHandler = (req, res, next) => {
  console.log('Update Comment');
  res.send('Update Comment');
};
