import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Formats a date as a string representing the time from now.
 *
 * @param date The date to format.
 * @returns A string representing the time from now.
 */
const getTimeFromNow = (date: Date) => {
  return dayjs(date).fromNow();
};

export default getTimeFromNow;
