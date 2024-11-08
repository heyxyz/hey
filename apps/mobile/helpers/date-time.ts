import dayjs from "dayjs";

/**
 * @param dateString
 * @returns a short hand time (eg. 1h, 1d, 1m, etc.)
 */
export const getShortHandTime = (dateString: string) => {
  const targetDate = dayjs(new Date(dateString));
  const now = dayjs();

  const diffInMinutes = now.diff(targetDate, "minute");
  const diffInHours = now.diff(targetDate, "hour");
  const diffInDays = now.diff(targetDate, "day");

  if (diffInDays >= 1) {
    return targetDate.format(
      now.year() === targetDate.year() ? "MMM D" : "MMM D, YYYY"
    );
  }
  if (diffInMinutes <= 0) {
    return "now";
  }
  if (diffInHours >= 1) {
    return `${diffInHours}h`;
  }
  return `${diffInMinutes}m`;
};
