import Movement from "#models/movement.model.js";

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

}

export default movementService;