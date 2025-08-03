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
    role: {
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
      default: 'activo',
      enum: ['activo', 'inactivo']
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,      
      transform: function (doc, ret) {
        ret.id = ret._id.toString(); 
        delete ret._id;              
      }
    }
  }

);

const User = model('User', userSchema, 'users');

export default User;
