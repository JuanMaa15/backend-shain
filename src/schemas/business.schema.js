import z from 'zod';
import { safeString, safeStringOptional } from './utils/stringValidator';

const businessSchema = {

  updateBusiness: z.object({
    name: safeString(),
    goal: safeStringOptional(),
    type: safeStringOptional()
  })

}

export default businessSchema