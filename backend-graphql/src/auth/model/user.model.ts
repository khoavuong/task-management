import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export class User extends mongoose.Document {
  _id: String;
  username: String;
  password: String;
}
