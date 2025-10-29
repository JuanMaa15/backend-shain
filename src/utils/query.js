import { getLastDays, getLastsMonthsRange, getMonthRange, getYearRange } from "./dateTime.js"

export const queryByDate = {
    sevenDays: () => {
        const { start, end } = getLastDays(7);
        return { $gte: start, $lte: end  };
    },
    month: () => {
        const { start, end } = getMonthRange();
        return { date: { $gte: start, $lte: end  } }
    },
    quarter: () => {
        const { start, end } = getLastsMonthsRange(2);
        return { date: { $gte: start, $lte: end  } };
    },
    year: () => {
        const { start, end } = getYearRange();
        return { date: { $gte: start, $lte: end  } };
    },

}