import z from 'zod';
import { safeString, safeStringOptional } from './utils/stringValidator.js';
import { movementTypes } from '#config/constants.config.js';

const movementSchema = {

  createAndUpdate: z.object({
    type: safeString(),

    frecuencyType: safeStringOptional(),

    value: safeString(),

    description: safeStringOptional(),

    date: safeString()
  }).refine( (data) => {
    if (data.type === movementTypes.EXPENSE && !data.description) {
      return false;
    }
    return true;
  }, {
    path: ["description"],
    message: "La descripción es obligatoria"
  })

}

export default movementSchema;