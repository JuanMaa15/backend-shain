import z from 'zod';
import { safeString, safeStringOptional } from './utils/stringValidator.js';

const movementSchema = {

  createAndUpdate: z.object({
    type: safeString(),

    frecuencyType: safeStringOptional(),

    value: safeString(),

    description: safeString(),

    date: safeString()
  })

}

export default movementSchema;