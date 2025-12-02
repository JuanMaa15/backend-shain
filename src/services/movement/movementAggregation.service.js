import Movement from "#models/movement.model.js";
import { getMonthRange, getYearRange } from "#utils/dateTime.js";
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

  getTotalTransactionsDayBusiness: async({date, business}) => {
  
    const movements = await Movement.aggregate([
      {
        $match: {date, business: toObjectId(business)}
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

  getTotalTransactionsMonthBusiness: async(business) => {
  
    const { start, end } = getMonthRange();
      
    const movements = await Movement.aggregate([
      {
        $match: {
          business: toObjectId(business), 
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

  getTotalTransactionsYear: async(user) => {

    const { start, end } = getYearRange();
      
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

  getTotalTransactionsYearBusiness: async(business) => {

    const { start, end } = getYearRange();
    
    const movements = await Movement.aggregate([
      {
        $match: {
          business: toObjectId(business), 
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

  getDayMovementsFilters: async({ query }) => {

    //Reestructura la query para convetir las propiedades que son Id secundarios convertirlo en Objecto ID
    const parsedQuery = { ...query, ...(query.business && { business: toObjectId(query.business) })};

    const result = await Movement.aggregate([
      { $match: parsedQuery }, // Filtra por business, type, y rango de fechas,
      {
        $group: {
          _id: {
            date: {
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$date",
                timezone: "America/Bogota"
              },
            },
            type: "$type"
          },
          value: { $sum: "$value" },
          total: { $sum: "$value" }
        }
      },
      {
        $sort: { _id: 1 } // Ordena por fecha ascendente
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          type: "$_id.type",
          value: 1
        }
      }
    ]);

    return result;

  }

}



export default movementAggregationService;