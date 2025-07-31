import { movementTypes } from "#config/constants.config.js";
import Movement from "#models/movement.model.js";
import { getLastDays, getMonthRange } from "#utils/dateTime.js";
import { toObjectId } from "#utils/others.js";
import { format } from "date-fns";

const movementService = {

  createMovement: async(data) => await Movement.create(data),

  updateMovement: async(id, data) => await Movement.findOneAndUpdate( 
    {_id: id},
    { $set: data },
    {new: true}
  ),

  deleteMovement: async(id) => await Movement.findOneAndDelete({_id: id}),

  getOneMovement: async(id) => await Movement.findById(id),

  getMovementsByFilters: async(type = '', user) => {

    let movements;

    if (type) {
      movements = await movementService.getMovementsByTypeAndUser(type, user);
    }else{
      movements = await movementService.getMovementsByUser(user);
    }

    return movements;
  },

  getMovementsByTypeAndUser: async(type, user) => {

    let movements;

    if (type)
      movements = await Movement.find({type, user});
    else
      movements = await Movement.find({user});

    return movements;

  },

  getMovementsByUser: async(user) => await Movement.find({user}),

  getSummaryAndStatistics: async({date, user}) => {

    const totalIncomesDay = await movementService.getTotalTransactionsDay({date: new Date(date), user, type: movementTypes.INCOME});

    const totalTransactionsMonth = await movementService.getTotalTransactionsMonth(user);
    
    const dataSummary = {
      incomesDay: totalIncomesDay?.total || 0,
      incomesMonth: totalTransactionsMonth?.ingresoMes|| 0,
      expensesMonth: totalTransactionsMonth?.egresoMes || 0,
    }

    return dataSummary;
  },

  getTotalTransactionsDay: async({date, user, type}) => {

    const movements = await Movement.aggregate([
      {
        $match: {date, user: toObjectId(user), type}
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$value' }
        }
      }
    ]);

    const [totalIncomes] = movements;

    return totalIncomes;
  },

  getTotalTransactionsMonth: async(user) => {

    const { start, end } = getMonthRange();

    const movements = await Movement.aggregate([
      {
        $match: {
          user: toObjectId(user), 
          date: {$gte: start, $lte: end}
        }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: '$value' }
        }
      }
    ])

    const formattedTransactions = movements?.reduce( (acc, movement) => {
      acc[`${movement._id}Mes`] = movement.total;
      return acc;
    }, {});


    return formattedTransactions;

  },

  getlastMovementsByDateAndUser: async({days, user}) => {

    const { start, end } = getLastDays(days);

    const movements = await Movement.find({
      user,
      date:{ 
        $gte: start,
        $lte: end 
      }
    }).lean();

    const formattedMovements = movements.map( movement => ({
      type: movement.type,
      value: movement.value,
      date: format(movement.date, 'yyyy-MM-dd'),
    }));

    return {
      incomes: formattedMovements.filter( movement => movement.type === movementTypes.INCOME ),
      expense: formattedMovements.filter( movement => movement.type === movementTypes.EXPENSE ),
    };
  }

}

export default movementService;