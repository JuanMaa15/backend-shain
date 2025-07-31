import { endOfMonth, startOfMonth, subDays } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const timeZone = 'America/Bogota'

export const getMonthRange = (date = new Date()) => ({
  start: fromZonedTime(startOfMonth(date), timeZone),
  end: fromZonedTime(endOfMonth(date), timeZone)
});

export const getLastDays = ( daysNumber = 0 ) => {

  const dateNow = new Date();
  const lastDays = subDays(dateNow, daysNumber);

  return {
    start: fromZonedTime(lastDays, timeZone),
    end: fromZonedTime(dateNow, timeZone)
  }
}; 