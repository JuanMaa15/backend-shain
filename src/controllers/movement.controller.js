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
          date: newMovement.date
        }
      });
    } catch (error) {
      next(error);
    }

  },

  updateMovement: async(req, res, next) => {

    const {id} = req.params;
    const data = req.body;

    try {
      const updateMovement = await movementService.updateMovement(id, data);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: updateMovement
      });

    } catch (error) {
      next(error);
    }

  },

  deleteMovement: async(req, res, next) => {
   
    const {id} = req.params;

    try {
      
      await movementService.deleteMovement(id);
      
      return res.status(204);

    } catch (error) {
      next(error);
    }

  },

  getMovementsByfilters: async(req, res, next) => {

    const {type} = req.query;
    const user = req.params.userId;

    try {

      const movements = await movementService.getMovementsByTypeAndUser(type, user);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: movements

      });
    } catch (error) {
      next(error);
    }   

  },

  getMovement: async(req, res, next) => {

    const {id} = req.params;

    try {
      
      const movement = await movementService.getOneMovement(id);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: movement
      });

    } catch (error) {
      next(error);
    }

  },

  getSummary: async(req, res, next) => {

    const {date} = req.query;
    const user = req.params.userId;
    
    try {
      
      const summary = await movementService.getSummaryAndStatistics({date, user});

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: summary
      });

    } catch (error) {
      next(error);
    }

  },

  getMovementsLastDays: async(req, res, next) => {

    const {days} = req.query;
    const user = req.user.id;

    try {
      
      const movements = await movementService.getlastMovementsByDateAndUser({days, user});

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: movements
      });

    } catch (error) {
      next(error);
    }

  }

}

export default movementController;