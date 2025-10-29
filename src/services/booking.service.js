import Booking from "#models/booking.model.js";
import { AppError } from "#utils/appError.js";
import { getDayRange, getMonthRange } from "#utils/dateTime.js";
import { format } from "date-fns";

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


  getBookingsByFilters: async({filter, user}) => {

    let bookings;

    //Opciones para las diferentes consultas segun los filtros ingresados 
    const optionsQuery = {
      today: () => { 
        const { start, end } = getDayRange();
        return { date: { $gte: start, $lte: end  } }  
      },
      month: () => {
        const { start, end } = getMonthRange();
        return { date: { $gte: start, $lte: end  } }
      }, 
    }
    
    if (filter && filter !== 'all' && optionsQuery[filter]){
      const query = optionsQuery[filter]();
      console.log(query);
      bookings = await bookingService.getBookingsByDateAndUser(query.date, user);
    }else {
      bookings = await bookingService.getBookingsByUser(user);
    }

    return bookings;

  },

  getBookingsByUser: async(user) => await Booking.find({user}),

  getBookingsByDateAndUser: async(date, user) => await Booking.find({date, user}),

  getBookingByDateAndTimeSlot: async(date, timeSlot) => await Booking.findOne({date, timeSlot}),

  deleteBooking: async(id) => await Booking.findByIdAndDelete(id)

}

export default bookingService;