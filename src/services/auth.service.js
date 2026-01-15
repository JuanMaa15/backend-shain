import ResetToken from "#models/resetToken.model.js";
import { AppError } from "#utils/appError.js";
import { SALT_ROUNDS } from '#config/env.config.js';
import bcrypt from 'bcrypt'
import userService from "./user.service.js";
import businessService from "./business.service.js";
import { userRoles, userStatus } from "#config/constants.config.js";
import { generateCode } from "#utils/others.js";

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

    // Verificar que el codigo de negocio ingresado si exista
    let business = '';
    if (data.role === userRoles.SERVICE_PROVIDER) {

      business = await businessService.getOneBusinessbyCode( data.businessCode );

      if (!business) throw new AppError('error', 'El código de negocio no existe', 400);

    } 

    let newUser = await userService.createUser(formattedData);
    

    // Si el usuario es un prestador de servicio asignar la empresa a la que pertenece 
    // segun el codigo proporcionado
    if (data.role === userRoles.SERVICE_PROVIDER) {
      const dataUpdate = { business: business._id };

      const userUpdate = await userService.updateUser(newUser._id, dataUpdate);
      newUser = userUpdate; 
    } 

    //Crear negocio solo para cuando el rol es un propietario de negocio
    if ( data.role === userRoles.BUSINESS_OWNER ) {
      const newBusiness = await businessService.createBusiness({
        user:newUser._id, 
        businessJoinCode: generateCode()
      });

      const dataUpdate = { business: newBusiness._id };

      const userUpdate = await userService.updateUser(newUser._id, dataUpdate);

      newUser = userUpdate; 

    }

    

    return newUser;

  },

  login: async({username, password}) => {

    const user = await userService.getUserByUsername(username);

    if(!user) throw new AppError('error', 'Nombre de usuario o contraseña incorrectos.', 400);

    const isValid = await authService.comparePassword(password, user.password);

    if (!isValid) throw new AppError('error', 'Nombre de usuario o contraseña incorrectos.', 400);

    if (user.status === userStatus.INACTIVE) throw new AppError('error', 'Su cuenta se encuentra inactiva.', 401);

    //Validar si el periodo de prueba ya expirado
    const hasTrialExpired = await userService.validateTrialPeriod({dateCreate: new Date(user.createdAt), dateNow: new Date(), userId: user._id });

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

  changePassword: async(id, data) => {

    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      throw new AppError('error', 'Las contraseñas no coinciden.', 400);
    }
    
    const user = await userService.getOneUser(id, true);

    const isEquals = await authService.comparePassword(data.currentPassword, user.password);

    if (!isEquals) {
      throw new AppError('error', 'La contraseña actual es incorrecta.', 400);
    }

    const hashedPassword = await authService.hashedPassword(password);

    const updatedUser = await userService.updateUser(id, { password: hashedPassword } );

    return updatedUser;
  },

  hashedPassword: async(password) => await bcrypt.hash(password, parseInt(SALT_ROUNDS, 10)),

  comparePassword: async(password, hashPassword) => await bcrypt.compare(password, hashPassword),

   
}

export default authService;