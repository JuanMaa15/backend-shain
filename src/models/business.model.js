import { Schema, model } from "mongoose";

const businessSchema = new Schema({
  name: {
    type: String,
  },
  goal: {
    type: Number,
  },
  type: {
    type: String,
  },
  image: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},{
  timestamps: true
});

const Business = model('Business', businessSchema, 'business');

export default Business;