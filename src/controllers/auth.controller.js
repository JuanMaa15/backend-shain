import { configureTokenCookie } from "#config/cookie.config.js";
import { createAccessToken } from "#libs/jwt.lib.js";
import ResetToken from "#models/resetToken.model.js";
import authService from "#services/auth.service.js";
import mailService from "#services/mail.service.js";
import userService from "#services/user.service.js";
import { createSecureToken } from "#utils/others.js";

const authController = {

  login: async(req, res, next) => {
    
    const {username, password} = req.body;

    try {
      
      const user = await authService.login({username, password});

      const token = await createAccessToken({
        id: user.id, 
        username: user.username, 
        status: user.status,
        role: user.role,
        business: user.business?._id ?? null,
      });

      configureTokenCookie(res, token);

      return res.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          username: user.username,
          status: user.status,
          role: user.role,
          business: user.business?._id ?? null,
          businessImage: user.business?.image ?? null,
          goal: user?.goal ?? 0
        }
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
      
      const newUser = await authService.registerUser(data);

      const token = await createAccessToken({
        id: newUser._id, 
        username: newUser.username, 
        status: newUser.status,
        role: newUser.role, 
        business: newUser.business
      }); 

      configureTokenCookie(res, token);

      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado correctamente.',
        data: {
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          business: newUser.business
        }
      });

    } catch (error) {
      
      next(error);

    }

  },

  requestPasswordChange: async(req, res, next) => {

    const {email} = req.body;

    try {
      
      const user = await userService.getUserByEmail(email);

      if (!user) return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Si el correo existe, recibirás un enlace'
      });

      const token = createSecureToken();
      await ResetToken.create({user: user._id, token});
      await mailService.sendResetMail({ email: user.email, token });

      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Si el correo existe, recibirás un enlace'
      });

    } catch (error) {
      next(error);
    }

  },

  resetPassword: async(req, res, next) => {

    const {token, password, confirmPassword} = req.body;

    try {
      
      const user = await authService.resetPassword({token, password, confirmPassword});

      return res.status(200).json({
        status: 'sucesss',
        code: 200,
        data: {
          id: user._id,
          username: user.username
        }
      });

    } catch (error) {
      next(error);
    }

  },

  updatePassword: async(req, res, next) => {

    const { id } = req.user;
    const data = req.body;

    try {
      
      const user = await authService.changePassword(id, data);

      return res.status(200).json({
        status: 'sucesss',
        code: 200,
        data: {
          id: user._id,
          username: user.username
        }
      });

    } catch (error) {
      next(error);
    }

  }



}

export default authController;