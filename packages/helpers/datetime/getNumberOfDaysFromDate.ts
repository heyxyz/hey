import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Gets the number of days between the current date and time and a specified date and time.
 * @param date The to date to calculate the number of days.
 * @returns The number of days between the current date and time and the specified date and time.
 */
const getNumberOfDaysFromDate = (date: Date) => {
  const currentDate = dayjs().startOf("day");
  const targetDate = dayjs(date).startOf("day");

  return targetDate.diff(currentDate, "day");
};

export default getNumberOfDaysFromDate;
