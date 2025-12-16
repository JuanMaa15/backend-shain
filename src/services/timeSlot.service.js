import TimeSlot from "#models/timeSlot.model.js";
import bookingService from "./booking.service.js";

const timeSlotService = {

  createTimeSlot: async(data) => await TimeSlot.create(data),

  updateTimeSlot: async(id, data) => await TimeSlot.findByIdAndUpdate(id, data, {new: true}),

  getActivesHours: async() => await TimeSlot.find({isActive: true}),

  getAvailablesHours: async({date, user}) => {

    const bookings = await bookingService.getBookingsByDateAndUser( new Date(date), user );

    const activesHours = await timeSlotService.getActivesHours();

    // Creamos un Set con los IDs de las horas ya reservadas
    const reservedSet = new Set( bookings.map(b => b.timeSlot.toString()) );

    // Filtramos las horas activas que no están en el Set
    //const availablesHours = activesHours.filter( hour => !reservedSet.has(hour._id) );
    const hours = activesHours.map( hour => ({
      id: hour._id,
      hour: hour.hour,
      available: !reservedSet.has(hour.id.toString())
    }));

    return hours;

  },

}

export default timeSlotService;