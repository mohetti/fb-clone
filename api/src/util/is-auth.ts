import { Request, Response, NextFunction } from 'express';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isLoggedIn) {
    return res.json({ status: 401 });
  }
  return next();
};

export default isAuth;
