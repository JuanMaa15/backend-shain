import rateLimit from 'express-rate-limit';

//Limitador general
export const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      code: 429,
      message: 'Demasiadas peticiones. Intenta nuevamente en 15 minutos.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});


//Limitador específico para el login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      code: 429,
      message: 'Demasiados intentos de inicio de sesión. Intenta en 10 minutos.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});


