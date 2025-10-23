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

    const {date} = req.query;
    const user = req.user.id;
  
    try {
      
      const bookings = await bookingService.getBookingsByFilters({date, user});

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: bookings
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