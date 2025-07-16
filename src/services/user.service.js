import { SALT_ROUNDS } from '#config/env.config.js';
import User from '#models/user.model.js';
import { AppError } from '#utils/appError.js';
import bcrypt from 'bcrypt'

const userService = {

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

    return user;

  },

  createUser: async(data) => await User.create(data),

  getUserByEmail: async(email) => await User.findOne({email}),

  getUserByUsername: async(username) => await User.findOne({username}),

  hashedPassword: async(password) => await bcrypt.hash(password, parseInt(SALT_ROUNDS, 10)),

  comparePassword: async(password, hashPassword) => await bcrypt.compare(password, hashPassword),

}

export default userService;