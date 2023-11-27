import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import dayjsTwitter from 'dayjs-twitter';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(dayjsTwitter);

/**
 * Formats a date as a string in the format used by the application.
 * @param date The date to format.
 * @returns A string in the application date format.
 */
export const formatDate = (date?: Date, format = 'MMMM D, YYYY') => {
  return dayjs(date).format(format);
};

/**
 * Gets the time resulting from adding a specified number of days to the current date and time, in UTC format.
 *
 * @param day The number of days to add.
 * @returns The resulting date and time in UTC format.
 */
export const getTimeAddedNDay = (day: number) => {
  return dayjs().add(day, 'day').utc().format();
};

/**
 * Gets the number of days between the current date and time and a specified date and time.
 * @param date The to date to calculate the number of days.
 * @returns The number of days between the current date and time and the specified date and time.
 */
export const getNumberOfDaysFromDate = (date: Date) => {
  const currentDate = dayjs().startOf('day');
  const targetDate = dayjs(date).startOf('day');
  return targetDate.diff(currentDate, 'day');
};

/**
 * Formats a date as a string representing the elapsed time between the date and the current time.
 *
 * @param date The date to format.
 * @returns A string representing the elapsed time between the date and the current time.
 */
export const getTimetoNow = (date: Date) => {
  return dayjs(date).toNow(true);
};

/**
 * Formats a date as a string in the format used by Twitter.
 *
 * @param date The date to format.
 * @returns A string in the Twitter date format.
 */
export const getTwitterFormat = (date: Date | string) => {
  return dayjs(new Date(date)).twitter();
};
