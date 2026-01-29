import { userStatus } from '#config/constants.config.js';
import User from '#models/user.model.js';
import { AppError } from '#utils/appError.js';
import { differenceInDays } from 'date-fns';
import { movementAggregationService } from './movement/index.js';

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

  updateReferralCodeUser: async(id, referralCode) => {

    //Validar que el nuevo codigo no exista en el sistema
    const user = await User.findOne({referralCode});

    if (user) throw new AppError('error', 'El código ya existe en el sistema.', 409);

    const updateUser = await User.findByIdAndUpdate(
      id,
      {referralCode},
      {new: true}
    );

    return updateUser;

  },

  getUsersByReferredByCode: async(referredByCode) => await User.find({referredByCode}),

  getUsersWithReferralCode: async() => await User.find({referralCode: {$ne: 'no-code'}}),


  getAllUsers: async() => await User.find().select('-password'),

  getOneUser: async(id, withCompleteInfo = false) => {

    let user = {};

    if (!withCompleteInfo) {
      user = await User.findById(id, { password: 0 });
    }else{
      user = await User.findById(id);
    }

    if (!user) throw new AppError('error', 'El usuario no existe en el sistema', 404);

    return user;

  },

  getUserByEmail: async(email) => await User.findOne({email}),

  getUserByUsername: async(username) => await User.findOne({username}).populate('business', 'image'),

  getUsersByBusiness: async(business) => 
    await User.find({business})
      .select('-password -__v'),

  getUsersPercentageGoalUsersByBusiness: async(userOwnerId) => {

    const userOwner = await User.findById(userOwnerId);

    const employees = await User.find( { business: userOwner.business } ).lean();

    let dataGoalsUsers = [];
    if (employees.length > 0) {
      dataGoalsUsers = await Promise.all(
        employees.map( async employee => {
          //Traer total ingresos y egresos del mes
          const totalTransactionsMonth = await movementAggregationService.getTotalTransactionsMonth(employee._id);
          //calcular balance mensual
          const monthBalance = totalTransactionsMonth.incomes - totalTransactionsMonth.expenses;

          let salesCompletePercentageGoal = 0;
          if (employee.goal > 0){
            //Calcular el porcentaje completado de ventas con respecto a la meta mensual del negocio
            salesCompletePercentageGoal = Math.round(Math.min(100, Math.max(0, (monthBalance * 100) / employee.goal))); 
          }

          return {
            name: `${ employee.name } ${ employee.lastName }`,
            monthBalance,
            goal: employee.goal,
            salesCompletePercentageGoal,
          }

        })
      );
    }

    return dataGoalsUsers;
  }

}

export default userService;