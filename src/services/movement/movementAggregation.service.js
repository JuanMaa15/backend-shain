import Movement from "#models/movement.model.js";
import { getDayRange, getMonthRange, normalizeUserDateToUTC } from "#utils/dateTime.js";
import { toObjectId } from "#utils/others.js";
import movementSummaryService from "./movementSummary.service.js";

const movementAggregationService = {
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
  
    return movementSummaryService._formatTransactions(movements);
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
  
    return movementSummaryService._formatTransactions(movements);
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
  
    return movementSummaryService._formatTransactions(movements);
  
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
  
    return movementSummaryService._formatTransactions(movements);
  
  },

  getDayMovementsFilters: async({ date, query }) => {


    //Rango de horas de la fecha
    const { start, end } = getDayRange( normalizeUserDateToUTC(date) );
    
    //Traer y agrupar los ingresos totales de la fecha 
    const result = await Movement.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          ...query
        }
      },
      {
        $group: { 
          _id: date,
          value: {$sum: "$value"}
        }
      },
    ]);

    return result;

  }

}



export default movementAggregationService;