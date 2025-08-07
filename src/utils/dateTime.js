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


export const dateLocal = (date = new Date()) => {

  //// Si es Date, le ponemos hora local 00:00:00 con toISOString cortado
  if (date instanceof Date) {
    //string ISO sin hora ni zona horaria
    const isoDate = date.toISOString().slice(0, 10) + 'T00:00:00';
    return fromZonedTime(isoDate, timeZone);
  }

  if (typeof date === 'string') {
    return fromZonedTime(date + 'T00:00:00', timeZone);
  }

  return null;
}