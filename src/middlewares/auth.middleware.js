import { JWT_SECRET_KEY } from "#config/env.config.js";
import jwt from "jsonwebtoken";

export const authRequired = async(req, res, next) => {

  const {token_shain: token} = req.cookies;
  
  if (!token) 
    return res.status(401).json({
      status: 'Unauthorized',
      code: 401,
      message: 'Autorización denegada'
    });

  try {
    const user = await jwt.verify(token, JWT_SECRET_KEY);
    req.user = user;

    return next();
  } catch (error) {

    if (error.name === 'TokenExpiredError')
      return res.status(401).json({
        status: 'Unauthorized',
        code: 401,
        message: 'El token ha expirado'
      })

    return res.status(500).json({
      status: 'Unauthorized',
      code: 401,
      message: 'El token ha expirado'
    })  

  }
}