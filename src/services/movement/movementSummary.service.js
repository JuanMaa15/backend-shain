import { userRoles } from "#config/constants.config.js";
import businessService from "#services/business.service.js";
import userService from "#services/user.service.js";
import { normalizeUserDateToUTC } from "#utils/dateTime.js";
import { subDays } from "date-fns";
import movementAggregationService from "./movementAggregation.service.js";
import movementService from "./movement.service.js";


const movementSummaryService = {
  
  getDayStatistics: async ({date, user, business, role}) => {

    //Traer total de ingresos y egresos
    const totalTransactions = await movementAggregationService.getTotalTransactionsByUser(user);
    //const totalBalance = totalTransactions.incomes;

    //Traer total ingresos y egresos del dia
    //const totalTransactionsDay = await movementAggregationService.getTotalTransactionsDay({date, user});

    const totalTransactionsDay = role === userRoles.BUSINESS_OWNER 
      ? await movementAggregationService.getTotalTransactionsDayBusiness({date, business}) 
      : await movementAggregationService.getTotalTransactionsDay({date, user});

    const existMovements = totalTransactionsDay.incomes !== 0 || totalTransactionsDay.expenses !== 0;
    //calcular balance diario
    const dailyBalance = totalTransactionsDay.incomes - totalTransactionsDay.expenses;

    //traer la fecha de ayer
    const yesterdayDate = subDays(new Date(date), 1);
    //Traer los ingresos y egresos de ayer
    const totalTransactionsYesterday = role === userRoles.BUSINESS_OWNER 
      ? await movementAggregationService.getTotalTransactionsDayBusiness({date: yesterdayDate, business}) 
      : await movementAggregationService.getTotalTransactionsDay({date: yesterdayDate, user}); 

    //Calcular el balance de ayer
    const yesterdayBalance = totalTransactionsYesterday.incomes - totalTransactionsYesterday.expenses;
  
    //Incremento de ventas del dia con respecto ayer
    const salesIncreaseAmountDay = dailyBalance - yesterdayBalance;
  
    let salesGrowthPercentageDay;
   
    if (yesterdayBalance === 0)
      salesGrowthPercentageDay = dailyBalance === 0 ? 0 : null;
    else
    //Calculo de porcentaje de crecimiento de ventas del dia con respecto ayer
      salesGrowthPercentageDay = (salesIncreaseAmountDay / Math.abs(yesterdayBalance)) * 100;

    return {
      totalTransactionsDay,
      existMovements,
      dailyBalance,
      salesIncreaseAmountDay: Math.round(salesIncreaseAmountDay),
      salesGrowthPercentageDay: salesGrowthPercentageDay === null ? 0 : (isFinite(salesGrowthPercentageDay) ? Math.round(salesGrowthPercentageDay) : 0),
    }

  },

  getMonthStatistics: async({ user, business, role, goalUser }) => {

    const dataBusiness = await businessService.getOneBusiness(business);
    const goal = Number(dataBusiness?.goal) || 0;
  
    // % avance meta mensual (clamp 0-100)
    let salesCompletePercentageGoal = 0;
    let dataGoals = {};

    //Traer total ingresos y egresos del mes
    const totalTransactionsMonth = role === userRoles.BUSINESS_OWNER 
      ? await movementAggregationService.getTotalTransactionsMonthBusiness(business)
      : await movementAggregationService.getTotalTransactionsMonth(user)
    //calcular balance mensual
    const monthBalance = totalTransactionsMonth.incomes - totalTransactionsMonth.expenses;

    
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
    
    return {
      totalTransactionsMonth,
      monthBalance,
      salesGrowthPercentageMonth: salesCompletePercentageGoal,
      ...dataGoals, 
    }

  },
  
  getSummaryAndStatistics: async({date, user, role, business, goalUser}) => {

    const dateUTC = normalizeUserDateToUTC(date);
    
    const totalTransactions = await movementAggregationService.getTotalTransactionsByUser(user);

    const dayStatistics = await movementSummaryService.getDayStatistics({date: dateUTC, user, business, role});
    
    const monthStatistics = await movementSummaryService.getMonthStatistics({ user, business, role, goalUser });

    //Si no hay movimientos y el balance diario es menor o igual a 0  no hubieron aumento de ventas
    if ( !dayStatistics.existMovements ) { 
      dayStatistics.salesIncreaseAmountDay = 0;
      dayStatistics.salesGrowthPercentageDay = 0;
    };

    const dataSummary = {
      dayStatistics,
      monthStatistics,
      totalIncomes: totalTransactions.incomes,
      totalExpenses: totalTransactions.expenses 
    }

    if (role === userRoles.BUSINESS_OWNER) {

      const totalTransactionsBusiness = await movementAggregationService.getTotalTransactionsByBusiness(business);

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


  _formatTransactions: (movements) => {
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

export default movementSummaryService;