import z from 'zod';
import {safeEmail, safePassword, safeString, safeStringOptional } from './utils/stringValidator.js';

const authSchema = {

  register: z.object({
    name: safeString(),
    lastName: safeString(),
    role: safeString(),
    username: safeString(),
    email: safeEmail(),
    password: safePassword(),
    confirmPassword: safePassword(),
    phone: safeStringOptional(),
  }),

  login: z.object({
    username: safeString(),
    password: safeString()
  }),

  requestPassword: z.object({
    email: safeEmail(),
  }),

  resetPassword: z.object({
    token: safeString(),
    password: safePassword(),
    confirmPassword: safePassword()
  }),

}

export default authSchema;