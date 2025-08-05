import { format } from "date-fns";
import { Schema, get, model } from "mongoose";

const bookingSchema = new Schema({
  date: {
    type: Date,
    required: true,
    get: (val) => format(val, "yyyy-MM-dd")
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  timestamps: true,
  toJSON: {
    virtuals: true,      
    getters: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString(); 
      delete ret._id;              
    }
  }
});

const Booking = model('Booking', bookingSchema, 'bookings');

export default Booking;

