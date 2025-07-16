import { Schema, model } from "mongoose";

const userSchema = new Schema(
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
    },
    status: {
      type: String,
      required: true,
      default: 'activo'
    }
  },
  {
    timestamps: true
  }

);

const User = model('User', userSchema, 'users');

export default User;
