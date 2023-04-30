import { i18n } from '@lingui/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import dayjsTwitter from 'dayjs-twitter';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(dayjsTwitter);

/**
 * Formats a date using the 'medium' date and time styles of the current locale.
 *
 * @param date The date to format.
 * @returns The formatted date and time.
 */
export const formatTime = (date: Date | undefined): string => {
  return date
    ? i18n.date(date, { dateStyle: 'medium', timeStyle: 'medium' })
    : '';
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
 * Gets the Unix timestamp resulting from adding a specified number of days to the current date and time.
 *
 * @param day The number of days to add.
 * @returns The resulting Unix timestamp.
 */
export const getTimeAddedNDayUnix = (day: number) => {
  return dayjs().add(day, 'day').unix();
};

/**
 * Gets the Unix timestamp resulting from subtracting a specified number of days from the current date and time.
 *
 * @param day The number of days to subtract.
 * @returns The resulting Unix timestamp.
 */
export const getTimeMinusNDayUnix = (day: number) => {
  return dayjs().subtract(day, 'day').unix();
};

/**
 * Formats a date as a string representing the elapsed time between the date and the current time.
 *
 * @param date The date to format.
 * @returns A string representing the elapsed time between the date and the current time.
 */
export const getTimeFromNow = (date: Date) => {
  return dayjs(new Date(date)).fromNow();
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
