import { JWT_SECRET_KEY } from '#config/env.config.js';
import jwt from 'jsonwebtoken';

export const createAccessToken = (payload) => {
  return jwt.sign(
    payload,
    JWT_SECRET_KEY,
    {
      expiresIn: '1d'
    }
  );
}