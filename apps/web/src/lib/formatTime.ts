import { i18n } from '@lingui/core';

const formatTime = (date: Date | undefined): string => {
  return date ? i18n.date(date, { dateStyle: 'medium', timeStyle: 'medium' }) : '';
};

export default formatTime;
