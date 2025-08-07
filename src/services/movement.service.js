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

    const totalIncomesDay = await movementService.getTotalTransactionsDay({date: new Date(date), user, type: movementTypes.INCOME});
    const totalExpensesDay = await movementService.getTotalTransactionsDay({date: new Date(date), user, type: movementTypes.EXPENSE});
    const dailyBalance = totalIncomesDay - totalExpensesDay;

    const totalTransactionsMonth = await movementService.getTotalTransactionsMonth(user);
    
    const incomesMonth = totalTransactionsMonth?.egresoMes || 0;

    const calculationSales = await movementService.calculationSales({user, incomesMonth, dailyBalance, date});

    const dataSummary = {
      incomesDay: totalIncomesDay?.total || 0,
      incomesMonth,
      expensesMonth: totalTransactionsMonth?.egresoMes || 0,
      calculationSales
    }

    return dataSummary;
  },

  calculationSales: async({user, incomesMonth, dailyBalance, date}) => {
    const business = await businessService.getOneBusinessByUser(user);

    //traer la fecha de ayer
    const yesterdayDate = subDays(new Date(date), 1);
    //Calcular sus ingresos y egresos
    const yesterdaytIncomes = await movementService.getTotalTransactionsDay({date: yesterdayDate, user, type: movementTypes.INCOME}) || 0; 
    const yesterdaytExpenses = await movementService.getTotalTransactionsDay({date: yesterdayDate, user, type: movementTypes.EXPENSE}) || 0; 
    //Calcular el balance de yer
    const yesterdayBalance = yesterdaytIncomes - yesterdaytExpenses;

    //Incremento de ventas del dia con respecto ayer
    const salesIncreaseAmountDay = dailyBalance - yesterdayBalance;

    //Calculo de porcentaje de crecimiento de ventas del dia con respecto ayer
    const salesGrowthPercentageDay = ((dailyBalance - yesterdayBalance) / Math.abs(yesterdayBalance) ) * 100;

    //Calcular el porcentaje completado de ventas con respecto a la meta mensual
    const salesCompletePercentageGoal = incomesMonth * 100 / business.goal;

    return {
      salesIncreaseAmountDay: Math.round(salesIncreaseAmountDay),
      salesGrowthPercentageDay: Math.round(salesGrowthPercentageDay),
      salesGrowthPercentageMonth: salesCompletePercentageGoal > 100 ? 100 : Math.round(salesCompletePercentageGoal),
      goal: business.goal
    }

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