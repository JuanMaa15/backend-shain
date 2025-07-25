import Booking from "#models/booking.model.js";

const bookingService = {

  getBookingsByDate: async(date) => await Booking.find({date}),

}

export default bookingService;