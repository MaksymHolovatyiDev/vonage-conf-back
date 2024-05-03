import {Schema, model} from 'mongoose';
import { UserModel } from 'types/models/user';

const userSchema = new Schema<UserModel>(
  {
    name: {type: String, required: true},
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
  },

  {timestamps: true},
);

export const User = model<UserModel>('User', userSchema);