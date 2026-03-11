import z from 'zod';
import { safeString, safeStringOptional } from './utils/stringValidator.js';

const businessSchema = {

  updateBusiness: z.object({
    //name: safeString(),
    goal: safeStringOptional(),
    description: safeStringOptional()
  })

}

export default businessSchema