import timeSlotService from "#services/timeSlot.service.js";


const timeSlotController = {

  getTimeSlots: async(req, res, next) => {

    try {
      
      const timeSlots = await timeSlotService.getActivesHours();

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: timeSlots
      })

    } catch (error) {
      next(error);
    }

  },

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

  },

  updateTimeSlot: async(req, res, next) => {

    const {id} = req.params;
    const data = req.body;

    try {
      
      const updatedTimeSlot = await timeSlotService.updateTimeSlot(id, data);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: updatedTimeSlot
      });

    } catch (error) {
      next(error);
    }

  }

}

export default timeSlotController;