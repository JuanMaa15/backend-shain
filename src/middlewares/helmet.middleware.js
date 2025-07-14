import helmet from 'helmet';

//Seguridad de encabezados
export const helmetConfig = helmet({
  contentSecurityPolicy: false,
  frameguard: {
    action: 'deny',
  },
  hidePoweredBy: true,
  dnsPrefetchControl: {
    allow: false,
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  xssFilter: true
});