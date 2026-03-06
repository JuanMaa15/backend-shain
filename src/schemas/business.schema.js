import z from 'zod';
import { safeString, safeStringOptional } from './utils/stringValidator.js';

const businessSchema = {

  updateBusiness: z.object({
    //name: safeString(),
    goal: safeStringOptional(),
    type: safeStringOptional()
  })

}

export default businessSchema