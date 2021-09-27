import { timeStamp } from 'console';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  time: { type: Date, default: Date.now },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
  comments: { type: [Object] },
});

const newMessage = mongoose.model('Message', MessageSchema);
export default newMessage;
