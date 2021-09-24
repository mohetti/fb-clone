import mongoose from 'mongoose';
import { UserInterface } from '../interfaces/userInterface';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 30 },
  surName: { type: String, required: true, maxLength: 30 },
  password: { type: String },
  email: { type: String, required: true, maxLength: 30 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendsRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  facebook: { type: String, select: false },
  img: { type: String },
});

UserSchema.virtual('url').get(function (this: UserInterface) {
  return '/user/' + this._id;
});

const newUser = mongoose.model('User', UserSchema);
export default newUser;
