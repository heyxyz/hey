import type { IUser } from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { CHAIN_ID } from 'src/constants';

export const getProfileFromDID = (did: string) => {
  return did.split(':').slice(-2, -1)[0];
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
