import { movementTypes } from "#config/constants.config.js";
import Movement from "#models/movement.model.js";
import { getLastDays, normalizeUserDateToUTC } from "#utils/dateTime.js";
import { queryByDate } from "#utils/query.js";
import movementAggregationService from "./movementAggregation.service.js";

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

    //Usuario
    if (user) {
      movements = await Movement.find(query);
      return movements.map( movement => ({
        ...movement._doc,
        date: movement.date.toISOString().slice(0, 10),
      }) );
    }

    //Negocio
    if(business) {   

      movements = await movementAggregationService.getDayMovementsFilters({query});
      return movements;

    }


  },

  getMovementsByUser: async(user) => await Movement.find({user}),

  /* getDailyMovementsByBusiness: async(query) => {

    //Reestructura la query para convetir las propiedades que son Id secundarios 
    //convertirlo en Objecto ID
    const parsedQuery = {
      ...query,
      ...(query.business && { business: toObjectId(query.business) })
    };
  
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

        const result = await movementAggregationService.getDayMovementsFilters({date, query: parsedQuery}) 
        
        return {
          date,
          value: result[0].value
        }
      })
    );
    
    //Ordenar por fechas y devolver
    return movementsOnDay.sort( (a, b) => new Date(a.date) - new Date(b.date) );
  }, */

  
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

  /*  getTotalTransactionsDayBusiness: async({date, business}) => {

    const { start, end } = getDayRange(date);

    const query = { business: toObjectId(business), date: { $gte: start, $lte: end } };

    const movements = await movementAggregationService.getDayMovementsFilters({query});
    console.log("Movimientos total del dia");
    console.log( movementSummaryService._formatTransactions(movements) );

    return movementSummaryService._formatTransactions(movements);
   

  }, */

}

export default movementService;