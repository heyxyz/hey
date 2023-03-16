import { i18n } from '@lingui/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import dayjsTwitter from 'dayjs-twitter';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(dayjsTwitter);

export const formatTime = (date: Date | undefined): string => {
  return date ? i18n.date(date, { dateStyle: 'medium', timeStyle: 'medium' }) : '';
};

export const getTimeAddedNDay = (day: number) => {
  return dayjs().add(day, 'day').utc().format();
};

export const getTimeAddedNDayUnix = (day: number) => {
  return dayjs().add(day, 'day').unix();
};

export const getTimeMinusNDayUnix = (day: number) => {
  return dayjs().subtract(day, 'day').unix();
};

export const getTimeFromNow = (date: Date) => {
  return dayjs(new Date(date)).fromNow();
};

export const getTwitterFormat = (date: Date | string) => {
  // @ts-ignore
  return dayjs(new Date(date)).twitter();
};
