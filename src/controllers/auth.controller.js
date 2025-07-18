import { configureTokenCookie } from "#config/cookie.config.js";
import { createAccessToken } from "#libs/jwt.lib.js";
import userService from "#services/user.service.js";

const authController = {

  login: async(req, res, next) => {
    
    const {username, password} = req.body;

    try {
      
      const user = await userService.login({username, password});

      const token = await createAccessToken({id: user.id, username: user.username});

      configureTokenCookie(res, token);

      return res.status(200).json({
        status: 'success',
        data: token
      });

    } catch (error) {
      next(error);
    }

  },

  logout: async(req, res) => {
    res.cookie('tolen', '', {
      expires: new Date(0)
    });

    return res.status(200).json({
      status:'success',
      message: 'Sesión cerrada correctamente.'
    });
  },

  register: async(req, res, next) => {
    
    const data = req.body;

    try {
      
      const newUser = await userService.registerUser(data);

      const token = await createAccessToken({id: newUser._id, username: newUser.username}); 

      configureTokenCookie(res, token);

      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado correctamente.',
        data: {
          name: newUser.name,
          username: newUser.username,
          email: newUser.username
        }
      });

    } catch (error) {
      
      next(error);

    }

  }

}

export default authController;