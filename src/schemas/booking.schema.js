import z from 'zod';
import { safeString, safeText } from './utils/stringValidator.js';

const bookingSchema = {

  create: z.object({

    date: safeString(),
    timeSlot: safeString(),
    customerName: safeString().default(""),
    description: safeText().default(""),

  }),

  update: z.object({

    customerName: safeString().optional(),
    description: safeText().optional(),

  }),

  updateStatus: z.object({

    status: z.enum(['pendiente', 'en proceso', 'terminado']),

  })

}

export default bookingSchema;