import Booking from "#models/booking.model.js";
import { AppError } from "#utils/appError.js";

const bookingService = {

  createBooking: async(data) => {

    const newBooking = await Booking.create(data);

    return await Booking.findById(newBooking._id).populate('timeSlot', 'hour');

  },

  createAndValidateBooking: async(data) => {

    const {date, timeSlot} = data;

    const booking = await bookingService.getBookingByDateAndTimeSlot( new Date(date), timeSlot );

    if (booking) throw new AppError('error', 'Este turno ya fue reservado', 409);

    const newBooking = await bookingService.createBooking(data);

    return newBooking;
  },


  getBookingsByFilters: async({date = '', user}) => {

    let bookings;
  
    if (date)
      bookings = await bookingService.getBookingsByDateAndUser(new Date(date), user);
    else
      bookings = await bookingService.getBookingsByUser(user);

    return bookings;

  },

  getBookingsByUser: async(user) => await Booking.find({user}),

  getBookingsByDateAndUser: async(date) => await Booking.find({date, user}),

  getBookingByDateAndTimeSlot: async(date, timeSlot) => await Booking.findOne({date, timeSlot}),

}

export default bookingService;