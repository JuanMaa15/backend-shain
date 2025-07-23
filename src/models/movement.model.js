import { format } from 'date-fns';
import {Schema, model} from 'mongoose';

const movementSchema = new Schema(
  {
    type: {
      type: String,
      required: true
    },
    frecuencyType: {
      type: String,
      required:true
    },
    value: {
      type: String,
      required: true,
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      //Validar si es requerido o no
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
      transform: function (doc, ret) {
        ret.id = ret._id.toString(); 
        ret.date = format(ret.date, "yyyy-MM-dd");
        delete ret._id;              
      }
    }
  }
);

const Movement = model('Movement', movementSchema, 'movements');

export default Movement;