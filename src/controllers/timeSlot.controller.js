import timeSlotService from "#services/timeSlot.service.js";


const timeSlotController = {

  getAvailablesHours: async(req, res, next) => {

    const {date} = req.query;
    const user = req.user.id;

    try {
      
      const availablesHours = await timeSlotService.getAvailablesHours({date, user});

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: availablesHours
      })

    } catch (error) {
      next(error);
    }

  },

  createTimeSlot: async(req, res, next) => {

    const data = req.body;

    try {
      
      const newTimeSlot = await timeSlotService.createTimeSlot(data); 

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: newTimeSlot
      })

    } catch (error) {
      next(error);
    }

  }

}

export default timeSlotController;