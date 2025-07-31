import { Schema, model } from "mongoose";

const resetTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  used: {
    type: Boolean,
    required: true,
    default: false
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900
  }
});

const ResetToken = model('ResetToken', resetTokenSchema, 'resetTokens');

export default ResetToken;