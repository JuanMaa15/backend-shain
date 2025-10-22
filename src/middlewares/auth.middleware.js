import { userRoles, userStatus } from "#config/constants.config.js";
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
  const registerId = Object.values(req.params)[0]; //Devuelve el valor del parametro establecido
  
  try {
    const register = await model.findById(registerId);

    //Si el usuario que inicio sesion es propietario y el usuario que va a buscar y traer
    //pertenece a su negocio, continua (Esto solo si el registro obtenido es un usuario)
    if (req.user.role === userRoles.BUSINESS_OWNER
        && register?.username //Verificar si tiene ese campo para validar si es un usuario
        && req.user.business === register?.business.toString())  return next();
    
    //Si el usuario que inicio sesion coincide, continua
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

export const authorizeRole = (...allowedRoles) => async(req, res, next) => {
  
  const roleUser = req.user.role; 

  if (!allowedRoles.includes(roleUser)) 
    return res.status(401).json({
      status: 'Unauthorized',
      code: 401,
      message: 'Autorización denegada'
    });

  return next();

}