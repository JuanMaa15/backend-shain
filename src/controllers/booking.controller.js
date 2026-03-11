import bookingService from "#services/booking.service.js";

const bookingController = {

  createBooking: async(req, res, next) => {

    const data = req.body;
    const user = req.user.id;
    const userData = {...data, user};

    try {
      
      const newBooking = await bookingService.createAndValidateBooking(userData);

      return res.status(201).json({
        status: 'success',
        code: 201,
        data: {
          date:newBooking.date,
          hour:newBooking.timeSlot.hour,
          client: newBooking.customerName
        }
      });

    } catch (error) {
      next(error);
    }

  },

  getBookingsByFilters: async(req, res, next) => {

    const {filter} = req.query; //today - month - all
    const user = req.user.id;
  
    try {
      
      const bookings = await bookingService.getBookingsByFilters({filter, user});

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: bookings
      });

    } catch (error) {
      next(error);
    }

  }, 

  updateBooking: async(req, res, next) => {

    const { id } = req.params;
    const { customerName, description } = req.body;

    try {

      const updated = await bookingService.updateBooking(id, { customerName, description });

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          customerName: updated.customerName,
          description: updated.description
        }
      });

    } catch (error) {
      next(error);
    }

  },

  updateBookingStatus: async(req, res, next) => {

    const { id } = req.params;
    const { status } = req.body;

    try {

      const updated = await bookingService.updateBooking(id, { status });

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          status: updated.status
        }
      });

    } catch (error) {
      next(error);
    }

  },

  deleteBooking: async(req, res, next) => {

    const { id } = req.params;

    try {
      
      await bookingService.deleteBooking(id);

      return res.status(204);

    } catch (error) {
      next(error);
    }

  }

}

export default bookingController