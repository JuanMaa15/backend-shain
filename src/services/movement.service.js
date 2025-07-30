import { movementTypes } from "#config/constants.config.js";
import Movement from "#models/movement.model.js";
import { getMonthRange } from "#utils/dateTime.js";
import { toObjectId } from "#utils/others.js";

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
    console.log(`Egresos por dia: ${totalIncomesDay.total}`);

    const totalTransactionsMonth = await movementService.getTotalTransactionsMonth(user);
    console.log('Egresos e ingresos totales de este mes');
    console.log(totalTransactionsMonth);

    return true;
  },

  getTotalTransactionsDay: async({date, user, type}) => {
    console.log(date, user, type);  
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

    console.log(movements);
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

    const formattedTransactions = movements.reduce( (acc, movement) => {
      acc[movement._id] = movement.total;
      return acc;
    }, {});

    return formattedTransactions;

  }

}

export default movementService;