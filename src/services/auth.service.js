import ResetToken from "#models/resetToken.model.js";
import { AppError } from "#utils/appError.js";
import { SALT_ROUNDS } from '#config/env.config.js';
import bcrypt from 'bcrypt'
import userService from "./user.service.js";
import businessService from "./business.service.js";

const authService = {
  
  registerUser: async(data) => {

    //Validar si el nombre de usuario ya existe
    const userByUsername = await userService.getUserByUsername(data.username);
    
    if(userByUsername) throw new AppError('error', 'El nombre de usuario ya fue registrado', 400);

    //Validar si el correo ya existe
    const userByEmail = await userService.getUserByEmail(data.email); 

    if (userByEmail) throw new AppError('error', 'El correo ya fue registrado', 400);

    const {password, confirmPassword, ...dataUser} = data;

    //Validar la confirmacion de contraseñas
    if (password !== confirmPassword) throw new AppError('error', 'Las contraseñas no coinciden', 400);

    const hashedPassword = await authService.hashedPassword(password);

    const formattedData = {...dataUser, password: hashedPassword};

    const newUser = await userService.createUser(formattedData);
    
    //Crear negocio
    await businessService.createBusiness({user:newUser._id});

    return newUser;

  },

  login: async({username, password}) => {

    const user = await userService.getUserByUsername(username);

    if(!user) throw new AppError('error', 'Nombre de usuario o contraseña incorrectos.', 400);

    const isValid = await authService.comparePassword(password, user.password);

    if (!isValid) throw new AppError('error', 'Nombre de usuario o contraseña incorrectos.', 400);

    //Validar si el periodo de prueba ya expirado
    const hasTrialExpired = userService.validateTrialPeriod(new Date(user.createdAt), new Date() );

    if (hasTrialExpired) throw new AppError('error', 'Tu periodo de prueba ha expirado. Por favor, actualiza tu plan.', 403);

    return user;

  },

  

  resetPassword: async({token, password, confirmPassword}) => {

    const requestToken = await ResetToken.findOne({token, used: false});

    if (!requestToken) throw new AppError('error', 'Token invalido o expirado', 401);

    if (password !== confirmPassword) throw new AppError('error', 'Las contraseñas no coinciden', 400);

    const hashedPassword = await authService.hashedPassword(password);

    const updateUser = await userService.updateUser(
      { _id: requestToken.user },
      { $set: {password: hashedPassword} },
      {new: true}
    );

    return updateUser;

  },

  hashedPassword: async(password) => await bcrypt.hash(password, parseInt(SALT_ROUNDS, 10)),

  comparePassword: async(password, hashPassword) => await bcrypt.compare(password, hashPassword),

   
  
  
}

export default authService;