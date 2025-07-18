import movementService from "#services/movement.service.js";

const movementController = {

  createMovement: async(req, res, next) => {

    const data = {...req.body, user: req.user.id};

    try {
      const newMovement = await movementService.createMovement(data);

      return res.status(201).json({
        status: 'success',
        message: 'Movimiento registrado correctamente.',
        data: {
          type: newMovement.type,
          description: newMovement.description,
          value: newMovement.value,
          date: ""
        }
      });
    } catch (error) {
      next(error);
    }

  }

}

export default movementController;