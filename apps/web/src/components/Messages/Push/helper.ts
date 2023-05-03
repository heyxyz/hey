import type { IUser } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { LENSHUB_PROXY } from 'data';
import { CHAIN_ID } from 'src/constants';
import { PUSH_ENV } from 'src/store/push-chat';

export const HANDLE_SUFFIX = {
  LENS: '.lens',
  TEST: '.test'
} as const;

// type ChatTypes = (typeof H)[keyof typeof CHAT_TYPES];

export const getProfileFromDID = (did: string) => {
  return did?.split(':')?.slice(-2, -1)[0];
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

export const getIsHandle = (handle: string) => {
  console.log(HANDLE_SUFFIX.LENS);
  if (PUSH_ENV === ENV.STAGING) {
    return handle.includes(HANDLE_SUFFIX.TEST);
  }
  if (PUSH_ENV === ENV.PROD) {
    return handle.includes(HANDLE_SUFFIX.LENS);
  }
};
