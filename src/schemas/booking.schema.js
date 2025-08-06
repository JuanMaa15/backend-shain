import z from 'zod';
import { safeString, safeText } from './utils/stringValidator.js';

const bookingSchema = {

  create: z.object({

    date: safeString(),
    timeSlot: safeString(),
    customerName: safeString(),
    description: safeText(),
    
  })

}

export default bookingSchema;