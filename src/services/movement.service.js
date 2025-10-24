import { movementTypes, userRoles } from "#config/constants.config.js";
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

  getMovementsByFilters: async({type, user}) => {

    let movements;

    if (type && user)
      movements = await Movement.find({type, user});
    else if (user)
      movements = await Movement.find({user});

    return movements.map( movement => ({
      ...movement._doc,
      date: movement.date.toISOString().slice(0, 10),
    }) );

  },

  getMovementsByUser: async(user) => await Movement.find({user}),

  getDailyMovementsByBusiness: async({ type, business }) => {

    const movements = await Movement.find({type, business});

    //const setMovements = [...new Set()]

    //Obtener y remover fechas duplicadas de los registros de los movimientos devolviuendo 
    //solo la fecha 
    const movementsDates = [...new Map(
      movements.map( item => [item.date.toISOString().slice(0, 10), item.date.toISOString().slice(0, 10) ] 
      ) 
    ).values()];

    console.log(movementsDates);
    return [];
  },

  getSummaryAndStatistics: async({date, user, role, business}) => {

    //Traer total de ingresos y egresos
    const totalTransactions = await movementService.getTotalTransactionsByUser(user);
    //const totalBalance = totalTransactions.incomes;

    //Traer total ingresos y egresos del dia
    const totalTransactionsDay = await movementService.getTotalTransactionsDay({date: new Date(date), user});
    const existMovements = totalTransactionsDay.incomes !== 0 || totalTransactionsDay.expenses !== 0;
    //calcular balance diario
    const dailyBalance = totalTransactionsDay.incomes;
   
    //Traer total ingresos y egresos del mes
    const totalTransactionsMonth = await movementService.getTotalTransactionsMonth(user);
    //calcular balance mensual
    const monthBalance = totalTransactionsMonth.incomes - totalTransactionsMonth.expenses;

    const calculationSales = await movementService.calculationSales({user, monthBalance, dailyBalance, date});

    //Si no hay movimientos y el balance diario es menor o igual a 0  no hubieron aumento de ventas
    if ( !existMovements ) { 
      calculationSales.salesIncreaseAmountDay = 0;
      calculationSales.salesGrowthPercentageDay = 0;
    };

    const dataSummary = {
      totalTransactionsDay,
      dailyBalance,
      totalTransactionsMonth,
      monthBalance,
      calculationSales,
      totalIncomes: totalTransactions.incomes,
      totalExpenses: totalTransactions.expenses 
    }

    if (role === userRoles.BUSINESS_OWNER) {

      const totalTransactionsBusiness = await movementService.getTotalTransactionsByBusiness(business);

      //Margen de beneficio
      const profitMargin = totalTransactionsBusiness.incomes - totalTransactionsBusiness.expenses;

      return { 
        ...dataSummary,
        totalBusinessIncomes: totalTransactionsBusiness.incomes,
        totalBusinessExpenses: totalTransactionsBusiness.expenses,
        profitMargin
      }
    }

    return dataSummary;
  },

  calculationSales: async({user, monthBalance, dailyBalance, date}) => {
    const business = await businessService.getOneBusinessByUser(user);
    const goal = Number(business?.goal) || 0;

    //traer la fecha de ayer
    const yesterdayDate = subDays(new Date(date), 1);
    //Traer los ingresos y egresos de ayer
    const totalTransactionsDay = await movementService.getTotalTransactionsDay({date: yesterdayDate, user}); 

    //Calcular el balance de ayer
    const yesterdayBalance = totalTransactionsDay.incomes - totalTransactionsDay.expenses;

    //Incremento de ventas del dia con respecto ayer
    const salesIncreaseAmountDay = dailyBalance - yesterdayBalance;

    let salesGrowthPercentageDay;

    if (yesterdayBalance === 0)
      salesGrowthPercentageDay = dailyBalance === 0 ? 0 : null;
    else
      //Calculo de porcentaje de crecimiento de ventas del dia con respecto ayer
      salesGrowthPercentageDay = (salesIncreaseAmountDay / Math.abs(yesterdayBalance)) * 100;


    // % avance meta mensual (clamp 0-100)
    let salesCompletePercentageGoal = 0;

    if (goal > 0)
      //Calcular el porcentaje completado de ventas con respecto a la meta mensual
      salesCompletePercentageGoal = Math.round(Math.min(100, Math.max(0, (monthBalance * 100) / goal))); 
    
    return {
      salesIncreaseAmountDay: Math.round(salesIncreaseAmountDay),
      salesGrowthPercentageDay: salesGrowthPercentageDay === null ? 0 : (isFinite(salesGrowthPercentageDay) ? Math.round(salesGrowthPercentageDay) : 0),
      salesGrowthPercentageMonth: salesCompletePercentageGoal,
      goal
    }

  },

  getTotalTransactionsByBusiness: async(business) => {
    const movements = await Movement.aggregate([
      {
        $match: {
          business: toObjectId(business)
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

  getTotalTransactionsByUser: async(user) => {
    const movements = await Movement.aggregate([
      {
        $match: {user: toObjectId(user)}
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