import { i18n } from '@lingui/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import dayjsTwitter from 'dayjs-twitter';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(dayjsTwitter);

/**
 *
 * @param date date to format
 * @returns formatted time
 */
export const formatTime = (date: Date | undefined): string => {
  return date ? i18n.date(date, { dateStyle: 'medium', timeStyle: 'medium' }) : '';
};

/**
 *
 * @param day number of days to add
 * @returns the time added n days
 */
export const getTimeAddedNDay = (day: number) => {
  return dayjs().add(day, 'day').utc().format();
};

/**
 *
 * @param day number of days to add
 * @returns the time added n days in unix format
 */
export const getTimeAddedNDayUnix = (day: number) => {
  return dayjs().add(day, 'day').unix();
};

/**
 *
 * @param day number of days to subtract
 * @returns the time subtracted n days in unix format
 */
export const getTimeMinusNDayUnix = (day: number) => {
  return dayjs().subtract(day, 'day').unix();
};

/**
 *
 * @param date date to format
 * @returns formatted time from now
 */
export const getTimeFromNow = (date: Date) => {
  return dayjs(new Date(date)).fromNow();
};

/**
 *
 * @param date date to format
 * @returns the twitter format of the date
 */
export const getTwitterFormat = (date: Date | string) => {
  return dayjs(new Date(date)).twitter();
};
