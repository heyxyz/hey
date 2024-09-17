import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

/**
 * Gets the time resulting from adding a specified number of days to the current date and time, in UTC format.
 *
 * @param day The number of days to add.
 * @returns The resulting date and time in UTC format.
 */
const getTimeAddedNDay = (day: number) => {
  return dayjs().add(day, "day").utc().format();
};

export default getTimeAddedNDay;
