import { LENSHUB_PROXY } from '@hey/data/constants';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { CHAIN_ID } from 'src/constants';

dayjs.extend(calendar);

export const getAccountFromProfile = (lensProfileId: string) => {
  return `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${lensProfileId}`;
};

export const getProfileIdFromDID = (id: string) => {
  return id.split(':')[4];
};

export const dateToFromNowDaily = (timestamp: number): string => {
  const timestampDate = dayjs(timestamp).calendar(null, {
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    nextWeek: 'dddd',
    sameDay: '[Today]',
    sameElse: 'DD/MM/YYYY'
  });
  return timestampDate;
};
