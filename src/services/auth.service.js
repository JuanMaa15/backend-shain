import { AppError } from "#utils/appError.js";
import userService from "./user.service.js";

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

    const hashedPassword = await userService.hashedPassword(password);

    const formattedData = {...dataUser, password: hashedPassword};

    return userService.createUser(formattedData);

  },

  login: async({username, password}) => {

    const user = await userService.getUserByUsername(username);

    if(!user) throw new AppError('error', 'Nombre de usuario o contraseña incorrectos.', 400);

    const isValid = await userService.comparePassword(password, user.password);

    if (!isValid) throw new AppError('error', 'Nombre de usuario o contraseña incorrectos.', 400);

    //Validar si el periodo de prueba ya expirado
    const hasTrialExpired = userService.validateTrialPeriod(new Date(user.createdAt), new Date() );

    if (hasTrialExpired) throw new AppError('error', 'Tu periodo de prueba ha expirado. Por favor, actualiza tu plan.', 403);

    return user;

  },

  
  
}

export default authService;