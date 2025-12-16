import z from 'zod';
import { safeString } from './utils/stringValidator.js';

const timeSlotSchema = {

  createUpdate: z.object({
    hour: safeString(),
  }),

}

export default timeSlotSchema;