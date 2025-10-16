import z from 'zod';
import {safeEmail, safePassword, safeString, safeStringOptional } from './utils/stringValidator.js';
import { userRoles } from '#config/constants.config.js';

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
    businessCode: safeStringOptional(),
  }).refine( (data) => {
    if (data.role === userRoles.SERVICE_PROVIDER && !data.businessCode){
      return false;
    }
    return true;
  }, {
    path: ["businessCode"],
    message: "El código de negocio es obligatorio"
  } ),

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