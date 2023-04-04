import { Schema, Document, Model, model } from "mongoose";

export interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
}

export type UserModel = Model<UserDoc>

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    select:false
  },
  password: {
    type: String,
    required: true,
    select:false
  },
});

export const User = model<UserDoc, UserModel>("User", userSchema);
