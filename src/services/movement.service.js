import Movement from "#models/movement.model.js";

const movementService = {

  createMovement: async(data) => await Movement.create(data),

}

export default movementService;