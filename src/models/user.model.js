import { Schema, Model } from "mongoose";

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type:String
    }
  },
  {
    timestamps: true
  }

);

const User = Model('User', userSchema, 'users');

export default User;
