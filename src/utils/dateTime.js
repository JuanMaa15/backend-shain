import { endOfMonth, startOfMonth } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const timeZone = 'America/Bogota'

export const getMonthRange = (date = new Date()) => ({
  start: fromZonedTime(startOfMonth(date), timeZone),
  end: fromZonedTime(endOfMonth(date), timeZone)
});