import TimeSlot from "#models/timeSlot.model.js";
import { parseISO } from "date-fns";
import bookingService from "./booking.service.js";

const timeSlotService = {

  createTimeSlot: async(data) => await TimeSlot.create(data),

  getActivesHours: async() => await TimeSlot.find({isActive: true}),

  getAvailablesHours: async(date) => {

    const formattedDate = parseISO(date);

    const bookings = await bookingService.getBookingsByDate(formattedDate);

    const activesHours = await timeSlotService.getActivesHours();

    // Creamos un Set con los IDs de las horas ya reservadas
    const reservedSet = new Set( bookings.map(b => b.timeSlot) );

    // Filtramos las horas activas que no están en el Set
    const availablesHours = activesHours.filter( hour => !reservedSet.has(hour._id) );

    return availablesHours;

  },

}

export default timeSlotService;