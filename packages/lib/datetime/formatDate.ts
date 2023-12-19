import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Formats a date as a string in the format used by the application.
 * @param date The date to format.
 * @returns A string in the application date format.
 */
const formatDate = (date?: Date, format = 'MMMM D, YYYY') => {
  return dayjs(date).format(format);
};

export default formatDate;
