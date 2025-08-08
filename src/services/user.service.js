import { userStatus } from '#config/constants.config.js';
import User from '#models/user.model.js';
import { AppError } from '#utils/appError.js';
import { differenceInDays } from 'date-fns';

const userService = {

  validateTrialPeriod: async({dateCreate, dateNow, userId}) => {

    const daysPassed = differenceInDays(dateNow, dateCreate);

    if ( daysPassed > 14) {
      await userService.updateUser(userId, {status: userStatus.INACTIVE});
      return true;
    } 

    return false;

  },

  createUser: async(data) => await User.create(data),

  updateUser: async(id, data) => await User.findByIdAndUpdate(
    id,
    data,
    { new: true }
  ),

  getAllUsers: async() => await User.find().select('-password'),

  getOneUser: async(id) => {

    const user = await User.findById(id, { password: 0 })

    if (!user) throw new AppError('error', 'El usuario no existe en el sistema', 404);

    return user;

  },

  getUserByEmail: async(email) => await User.findOne({email}),

  getUserByUsername: async(username) => await User.findOne({username}),

}

export default userService;