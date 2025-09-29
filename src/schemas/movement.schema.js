import z from 'zod';
import { safeString, safeStringOptional } from './utils/stringValidator.js';

const movementSchema = {

  createAndUpdate: z.object({
    type: safeString(),

    frecuencyType: safeStringOptional(),

    value: safeString(),

    description: safeStringOptional(),

    date: safeString()
  }).refine( (data) => {
    if (data.type === "egreso" && !data.description) {
      return false;
    }
    return true;
  }, {
    path: ["description"],
    message: "La descripción es obligatoria"
  })

}

export default movementSchema;