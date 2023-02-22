import { i18n } from '@lingui/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const formatTime = (date: Date | undefined): string => {
  return date ? i18n.date(date, { dateStyle: 'medium', timeStyle: 'medium' }) : '';
};

export const getTimeAddedOneDay = () => {
  return dayjs().add(1, 'day').utc().format();
};

export const getTimeFromNow = (date: Date) => {
  return dayjs(new Date(date)).fromNow();
};
