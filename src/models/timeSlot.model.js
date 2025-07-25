import { Schema, model } from "mongoose"; 

const timeSlotSchema = new Schema({
  hour: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
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
});

const TimeSlot = model('TimeSlot', timeSlotSchema, 'TimeSlots');

export default TimeSlot;