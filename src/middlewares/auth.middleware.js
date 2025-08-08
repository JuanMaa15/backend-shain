import { userStatus } from "#config/constants.config.js";
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

    if (req.user.status === userStatus.INACTIVE) 
      return res.status(401).json({
        status: 'Unauthorized',
        code: 401,
        message: 'Su cuenta se encuentra inactiva'
      });

    return next();
  } catch (error) {

    if (error.name === 'TokenExpiredError')
      return res.status(401).json({
        status: 'Unauthorized',
        code: 401,
        message: 'El token ha expirado'
      })

    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Ha ocurrido un error inesperado en el servidor. Por favor, intente nuevamente más tarde.'
    }); 

  }
}

export const authorizeAccess = ({model}) => async(req, res, next) => {

  const userId = req.user.id;
  const registerId = req.params.id; 
  
  try {
    const register = await model.findById(registerId);
    if (userId === register?.user?.toString() || userId === register?._id.toString()) return next();
      
    return res.status(401).json({
      status: 'Unauthorized',
      code: 401,
      message: 'Autorización denegada'
    });
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Ha ocurrido un error inesperado en el servidor. Por favor, intente nuevamente más tarde.'
    }); 
  }

}