import bookingService from "#services/booking.service.js";

const bookingController = {

  createBooking: async(req, res, next) => {

    const data = req.body;
 
    try {
      
      const newBooking = await bookingService.createAndValidateBooking(data);

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

  } 

}

export default bookingController