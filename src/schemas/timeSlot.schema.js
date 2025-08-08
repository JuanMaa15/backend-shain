import z from 'zod';
import { safeString } from './utils/stringValidator.js';

const timeSlotSchema = {

  create: z.object({
    hour: safeString(),
  }),

}

export default timeSlotSchema;