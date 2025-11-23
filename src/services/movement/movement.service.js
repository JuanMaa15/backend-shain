import { movementTypes, userRoles } from "#config/constants.config.js";
import Movement from "#models/movement.model.js";
import { getDayRange, getLastDays, getMonthRange, normalizeUserDateToUTC } from "#utils/dateTime.js";
import { toObjectId } from "#utils/others.js";
import { format, isWithinInterval, subDays } from "date-fns";
import businessService from "../business.service.js";
import userService from "../user.service.js";
import { queryByDate } from "#utils/query.js";

const movementService = {

  createMovement: async(data) => {

    const dateUTC = normalizeUserDateToUTC(data.date);

    const formattedData = { ...data, date: dateUTC };

    return await Movement.create(formattedData);
  },

  updateMovement: async(id, data) => await Movement.findOneAndUpdate( 
    {_id: id},
    { $set: data },
    {new: true}
  ),

  deleteMovement: async(id) => await Movement.findOneAndDelete({_id: id}),

  getOneMovement: async(id) => await Movement.findById(id),

  getMovementsByFilters: async({type, user, business, filterDate}) => {
    let movements;
    const query = {};
    
    if(type) query.type = type;
    if(user) query.user = user;
    if(business) query.business = business;
    if (filterDate && filterDate !== 'all') query.date = queryByDate[filterDate]();

    if (user) {
      movements = await Movement.find(query);
      return movements.map( movement => ({
        ...movement._doc,
        date: movement.date.toISOString().slice(0, 10),
      }) );
    }

    if(business) {   
      movements = await movementService.getDailyMovementsByBusiness(query);

      if(filterDate && filterDate !== 'all') {
        //Extraer el inicio y final de la consulta
        const { $gte: startDate, $lte: endDate } = query.date;
        console.log(startDate, endDate);
        const resultMovementsFilters = [];
        movements.forEach( movement => {

          const dateMovement = normalizeUserDateToUTC(movement.date);

          //Validar si el movimiento se encuentra en el rango de fechas
          const isInRange = isWithinInterval(dateMovement, { start: startDate, end: endDate });

          if(isInRange) resultMovementsFilters.push(movement);

        });

        return resultMovementsFilters;
      }

      return movements;

    }


  },

  getMovementsByUser: async(user) => await Movement.find({user}),

  getDailyMovementsByBusiness: async(query) => {

    //Reestructura la query para convetir las propiedades que son Id secundarios 
    //convertirlo en Objecto ID
    const parsedQuery = {
      ...query,
      ...(query.business && { business: toObjectId(query.business) })
    };
    console.log(parsedQuery);
    const movements = await Movement.find(query);

    //Obtener y remover fechas duplicadas de los registros de los movimientos devolviuendo 
    //solo la fecha 
    const movementsDates = [...new Map(
      movements.map( item => [item.date.toISOString().slice(0, 10), item.date.toISOString().slice(0, 10) ] 
      ) 
    ).values()];
    
    //
    const movementsOnDay = await Promise.all(
      movementsDates.map(async date => {
        //Rango de horas de la fecha
        const { start, end } = getDayRange( normalizeUserDateToUTC(date) );

        //Traer y agrupar los ingresos totales de la fecha 
        const result = await Movement.aggregate([
          {
            $match: {
              date: { $gte: start, $lte: end },
              ...parsedQuery
            }
          },
          {
            $group: { 
              _id: date ,
              value: {$sum: "$value"}
            }
          },
        ]);

        return {
          date,
          value: result[0].value
        }
      })
    );
    
    //Ordenar por fechas y devolver
    return movementsOnDay.sort( (a, b) => new Date(a.date) - new Date(b.date) );
  },

  getSummaryAndStatistics: async({date, user, role, business, goalUser}) => {

    const dateUTC = normalizeUserDateToUTC(date);
    console.log(dateUTC);
    //Traer total de ingresos y egresos
    const totalTransactions = await movementService.getTotalTransactionsByUser(user);
    //const totalBalance = totalTransactions.incomes;

    //Traer total ingresos y egresos del dia
    const totalTransactionsDay = await movementService.getTotalTransactionsDay({date: dateUTC, user});
    const existMovements = totalTransactionsDay.incomes !== 0 || totalTransactionsDay.expenses !== 0;
    //calcular balance diario
    const dailyBalance = totalTransactionsDay.incomes - totalTransactionsDay.expenses;
   
    //Traer total ingresos y egresos del mes
    const totalTransactionsMonth = await movementService.getTotalTransactionsMonth(user);
    //calcular balance mensual
    const monthBalance = totalTransactionsMonth.incomes - totalTransactionsMonth.expenses;

    const calculationSales = await movementService.calculationSales({user, monthBalance, dailyBalance, date: dateUTC, role, goalUser});

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

  calculationSales: async({user, monthBalance, dailyBalance, date, role, goalUser}) => {
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
    let dataGoals = {};
    if (role === userRoles.BUSINESS_OWNER) {
      if (goal > 0){
        //Calcular el porcentaje completado de ventas con respecto a la meta mensual del negocio
        salesCompletePercentageGoal = Math.round(Math.min(100, Math.max(0, (monthBalance * 100) / goal))); 
      }

      const salesCompletePercentageGoalUsers = await userService.getUsersPercentageGoalUsersByBusiness(user);

      dataGoals = { goal, salesCompletePercentageGoalUsers };
      
    }else{
      if (goalUser > 0) 
        //Calcular el porcentaje completado de ventas con respecto a la meta mensual del usuario
        salesCompletePercentageGoal = Math.round(Math.min(100, Math.max(0, (monthBalance * 100) / goalUser)));

      dataGoals = { goal: goalUser };
    }
    
    const dataSales = {
      salesIncreaseAmountDay: Math.round(salesIncreaseAmountDay),
      salesGrowthPercentageDay: salesGrowthPercentageDay === null ? 0 : (isFinite(salesGrowthPercentageDay) ? Math.round(salesGrowthPercentageDay) : 0),
      salesGrowthPercentageMonth: salesCompletePercentageGoal,
      ...dataGoals, 
    }

    return dataSales

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