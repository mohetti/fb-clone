import { ObjectId } from 'mongoose';

export interface UserInterface {
  _id: ObjectId;
  firstName: string;
  surName: string;
  password: string;
  email: string;
  friends: [ObjectId];
  friendsRequest: [ObjectId];
  facebook: string;
  img: string;
}

export interface FacebookInterface {
  _id?: ObjectId;
  firstName: string;
  surName: string;
  email: string;
  friends: [string];
  friendsRequest: [ObjectId];
  facebook: ObjectId;
}
