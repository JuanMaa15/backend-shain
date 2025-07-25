import { format } from "date-fns";
import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
},
{
  timestamps: true,
  toJSON: {
    virtuals: true,      
    transform: function (doc, ret) {
      ret.id = ret._id.toString(); 
      ret.date = format(ret.date, "YYYY-MM-DD");
      delete ret._id;              
    }
  }
});

const Booking = model('Booking', bookingSchema, 'Bookings');

export default Booking;

