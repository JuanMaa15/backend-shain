import { Schema, get, model } from "mongoose";

const bookingSchema = new Schema({
  date: {
    type: Date,
    required: true,
    get: (val) => val.toISOString().slice(0, 10)
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  customerName: {
    type: String,
  },
  description: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pendiente', 'en proceso', 'terminado'],
    default: 'pendiente'
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

