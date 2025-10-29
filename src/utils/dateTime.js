import { endOfMonth, format, startOfDay, startOfMonth, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";


const timeZone = 'America/Bogota'


export const getDayRange = (date = new Date()) => ({
  start: new Date(date.setHours(0, 0 ,0, 0)),
  end: new Date(date.setHours(23, 59, 59, 999))
});

export const getMonthRange = (date = new Date()) => ({
  start: startOfMonth(date),
  end: endOfMonth(date),
  /* start: fromZonedTime(startOfMonth(date), timeZone),
   end: fromZonedTime(endOfMonth(date), timeZone) */
});

export const getLastDays = ( daysNumber = 0 ) => {

  const dateNow = normalizeUserDateToUTC(new Date());
  const lastDays = subDays(dateNow, daysNumber);

  return {
    start: startOfDay(lastDays),
    end: startOfDay(dateNow)
    /*  start: fromZonedTime(lastDays, timeZone),
      end: fromZonedTime(dateNow, timeZone) */
  }
}; 

export const toDateAtMidnightUTC = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd') + 'T00:00:00.000Z';
  return new Date(dateStr)
} 

export const toDateAtBeforeMidnightUTC = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd') + 'T23:59:59.999Z';
  return new Date(dateStr)
} 

//Convertir a la zona horaria local
export const normalizeUserDateToUTC = (date, timeZone = 'America/Bogota') => {
  let dateObj = '';
  if (date instanceof Date)
    dateObj = date; 
  else 
    dateObj = new Date(`${date}T00:00:00`);

  return toZonedTime(dateObj, timeZone);
}

/* export const dateLocal = (date = new Date()) => {

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
} */

  