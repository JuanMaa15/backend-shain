import { endOfMonth, format, startOfDay, startOfMonth, subDays } from "date-fns";

const timeZone = 'America/Bogota'


export const getDayRange = (date = new Date()) => ({
  start: toDateAtMidnightUTC(date),
  end: toDateAtBeforeMidnightUTC(date)
});

export const getMonthRange = (date = new Date()) => ({
  start: toDateAtMidnightUTC(startOfMonth(date)),
  end: toDateAtMidnightUTC(endOfMonth(date)),
  /* start: fromZonedTime(startOfMonth(date), timeZone),
   end: fromZonedTime(endOfMonth(date), timeZone) */
});

export const getLastDays = ( daysNumber = 0 ) => {

  const dateNow = new Date();
  const lastDays = subDays(dateNow, daysNumber);

  return {
    start: toDateAtMidnightUTC(startOfDay(lastDays)),
    end: toDateAtMidnightUTC(startOfDay(dateNow))
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

  