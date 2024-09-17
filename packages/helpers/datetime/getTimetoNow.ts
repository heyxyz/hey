import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Formats a date as a string representing the elapsed time between the date and the current time.
 *
 * @param date The date to format.
 * @returns A string representing the elapsed time between the date and the current time.
 */
const getTimetoNow = (date: Date) => {
  return dayjs(date).toNow(true);
};

export default getTimetoNow;
