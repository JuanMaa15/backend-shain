import { cors } from '#middlewares/cors.middleware.js';
import { errorHandler } from '#middlewares/errorHandler.js';
import { helmetConfig } from '#middlewares/helmet.middleware.js';
import { generalLimiter } from '#middlewares/rateLimiter.middleware.js';
import router from '#routes/index.js';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

//Cabeceras de seguridad
app.use(helmetConfig);

//Limita todo el trafico general
app.use(generalLimiter);

app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//Configuración rutas
app.use('/api', router);

//Configurar y atrapar errores
app.use(errorHandler);

export default app;