import z from 'zod';
import { safeEmail, safeString, safeStringOptional } from './utils/stringValidator.js';

const userSchema = {

  updateProfile: z.object({
    name: safeString(),

    lastName: safeString(),

    username: safeString(),

    email: safeEmail(),
    
  }),

  updateUser: z.object({
    name: safeString(),

    lastName: safeString(),

    username: safeString(),

    email: safeEmail(),

    role: safeString(),
    
    phone: safeStringOptional()

  })



}

export default userSchema;