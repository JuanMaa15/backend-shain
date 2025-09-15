import { NODE_ENV } from "./env.config.js"

export const configureTokenCookie = (res, token) => {
  res.cookie('token_shain', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'lax' : 'strict',
    domain: '.shain.finance',
    path: '/'
  });
}