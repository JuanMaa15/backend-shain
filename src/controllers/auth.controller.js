import { configureTokenCookie } from "#config/cookie.config.js";
import { createAccessToken } from "#libs/jwt.lib.js";
import userService from "#services/user.service.js";

const authController = {

  login: async(req, res) => {
    res.status(200).send("Logueando");
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