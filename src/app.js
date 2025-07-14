import { cors } from '#middlewares/cors.middleware.js';
import { helmetConfig } from '#middlewares/helmet.middleware.js';
import { generalLimiter } from '#middlewares/rateLimiter.middleware.js';
import router from '#routes/index.js';
import express from 'express';

const app = express();

//Cabeceras de seguridad
app.use(helmetConfig);

//Limita todo el trafico general
app.use(generalLimiter);

app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuración rutas
app.use('/api', router);

export default app;