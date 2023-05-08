import type { IUser } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { LENSHUB_PROXY } from 'data';
import moment from 'moment';
import { CHAIN_ID } from 'src/constants';
import { PUSH_ENV } from 'src/store/push-chat';

export const HANDLE_SUFFIX = {
  LENS: '.lens',
  TEST: '.test'
} as const;

export const isCAIP = (id: string) => {
  const prefix = `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:`;
  return id?.startsWith(prefix);
};

// returns chatId if group chatId is sent or send lens id if did is sent in prop
export const getProfileFromDID = (id: string) => {
  if (isCAIP(id)) {
    return id?.split(':')[4];
  }
  return id;
};

export const getCAIPFromLensID = (id: string) => {
  return `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${id}`;
};

export const isProfileExist = (connectedProfile: IUser | undefined) => {
  if (!connectedProfile || !connectedProfile.publicKey) {
    return false;
  }
  return true;
};

export const dateToFromNowDaily = (timestamp: number): string => {
  const timestampDate = moment(timestamp).calendar(null, {
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextWeek: 'dddd',
    sameElse: 'DD/MM/YYYY'
  });
  return timestampDate;
};

export const getIsHandle = (handle: string) => {
  if (PUSH_ENV === ENV.STAGING) {
    return handle.includes(HANDLE_SUFFIX.TEST);
  }
  if (PUSH_ENV === ENV.PROD) {
    return handle.includes(HANDLE_SUFFIX.LENS);
  }
};
