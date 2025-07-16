import { SALT_ROUNDS } from '#config/env.config.js';
import User from '#models/user.model.js';
import { AppError } from '#utils/appError.js';
import bcrypt from 'bcrypt'

const userService = {

  registerUser: async(data) => {

    //Validar si el correo ya existe
    const user = await userService.getUserByEmail(data.email); 

    if (user) throw new AppError('error', 'El correo ya fue registrado', 400);

    const {password, confirmPassword, ...dataUser} = data;

    //Validar la confirmacion de contraseñas
    if (password !== confirmPassword) throw new AppError('error', 'Las contraseñas no coinciden', 400);

    const hashedPassword = await userService.hashedPassword(password);

    const formattedData = {...dataUser, password: hashedPassword};

    return userService.createUser(formattedData);

  },


  createUser: async(data) => await User.create(data),

  getUserByEmail: async(email) => await User.findOne({email}),

  hashedPassword: async(password) => await bcrypt.hash(password, parseInt(SALT_ROUNDS, 10))

}

export default userService;