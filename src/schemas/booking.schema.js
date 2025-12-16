import z from 'zod';
import { safeString, safeText } from './utils/stringValidator.js';

const bookingSchema = {

  create: z.object({

    date: safeString(),
    timeSlot: safeString(),
    customerName: safeString().default(""),
    description: safeText().default(""),
    
  })

}

export default bookingSchema;