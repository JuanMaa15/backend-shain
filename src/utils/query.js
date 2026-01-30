import { getLastDays, getLastsMonthsRange, getMonthRange, getYearRange, normalizeUserDateToUTC } from "./dateTime.js"

export const queryByDate = {
  sevenDays: () => {
    const { start, end } = getLastDays(7);
    return { $gte: start, $lte: end  };
  },
  month: () => {
    const { start, end } = getMonthRange();
    return { $gte: start, $lte: end  } 
  },
  quarter: () => {
    const { start, end } = getLastsMonthsRange(2);
    return  { $gte: start, $lte: end  };
  },
  year: () => {
    const { start, end } = getYearRange();
    return { $gte: start, $lte: end  };
  },
  other: (from = new Date(), to = new Date()) => {

    const startLocal = normalizeUserDateToUTC(from);
    const endLocal = normalizeUserDateToUTC(to);

    return { $gte: startLocal, $lte: endLocal  };

  }
}