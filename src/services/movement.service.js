import { movementTypes } from "#config/constants.config.js";
import Movement from "#models/movement.model.js";
import { getLastDays, getMonthRange } from "#utils/dateTime.js";
import { toObjectId } from "#utils/others.js";
import { format, subDays } from "date-fns";
import businessService from "./business.service.js";

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

    //Traer total ingresos y egresos del dia
    const totalTransactionsDay = await movementService.getTotalTransactionsDay({date: new Date(date), user});
    //calcular balance diario
    const dailyBalance = totalTransactionsDay.incomes - totalTransactionsDay.expenses;
   
    //Traer total ingresos y egresos del mes
    const totalTransactionsMonth = await movementService.getTotalTransactionsMonth(user);
    //calcular balance mensual
    const monthBalance = totalTransactionsMonth.incomes - totalTransactionsMonth.expenses;

    const calculationSales = await movementService.calculationSales({user, monthBalance, dailyBalance, date});

    const dataSummary = {
      totalTransactionsDay,
      dailyBalance,
      totalTransactionsMonth,
      monthBalance,
      calculationSales
    }

    return dataSummary;
  },

  calculationSales: async({user, monthBalance, dailyBalance, date}) => {
    const business = await businessService.getOneBusinessByUser(user);
    
    //traer la fecha de ayer
    const yesterdayDate = subDays(new Date(date), 1);
    //Traer los ingresos y egresos de ayer
    const totalTransactionsDay = await movementService.getTotalTransactionsDay({date: yesterdayDate, user}); 

    //Calcular el balance de ayer
    const yesterdayBalance = totalTransactionsDay.incomes - totalTransactionsDay.expenses;

    //Incremento de ventas del dia con respecto ayer
    const salesIncreaseAmountDay = dailyBalance - yesterdayBalance;

    //Calculo de porcentaje de crecimiento de ventas del dia con respecto ayer
    const salesGrowthPercentageDay = ((dailyBalance - yesterdayBalance) / Math.abs(yesterdayBalance) ) * 100;

    //Calcular el porcentaje completado de ventas con respecto a la meta mensual
    const salesCompletePercentageGoal = monthBalance * 100 / business.goal || 0;

    return {
      salesIncreaseAmountDay: Math.round(salesIncreaseAmountDay),
      salesGrowthPercentageDay: Math.round(salesGrowthPercentageDay) || 0,
      salesGrowthPercentageMonth: salesCompletePercentageGoal > 100 ? 100 : Math.round(salesCompletePercentageGoal),
      goal: business.goal || 0
    }

  },

  getTotalTransactionsDay: async({date, user}) => {

    const movements = await Movement.aggregate([
      {
        $match: {date, user: toObjectId(user)}
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: '$value' }
        }
      }
    ]);

    return movementService.formatTransactions(movements);

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

    return movementService.formatTransactions(movements);

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
      date: movement.date.toISOString().slice(0, 10),
    }));
    
    return {
      incomes: formattedMovements.filter( movement => movement.type === movementTypes.INCOME ),
      expense: formattedMovements.filter( movement => movement.type === movementTypes.EXPENSE ),
    };
  },

  formatTransactions: (movements) => {
    //Convertir a objeto el array de movimientos
    const formattedTransactions = movements?.reduce( (acc, movement) => {
      acc[movement._id] = movement.total;
      return acc;
    }, {});

    return {
      incomes: formattedTransactions?.ingreso || 0,
      expenses: formattedTransactions?.egreso || 0
    };
  },

  

}

export default movementService;