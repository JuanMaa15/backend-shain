import z from 'zod';
import { safeString } from './utils/stringValidator.js';

const movementSchema = {

  createAndUpdate: z.object({
    type: safeString(),

    frecuencyType: safeString(),

    value: safeString(),

    description: safeString(),

    date: safeString()
  })

}

export default movementSchema;