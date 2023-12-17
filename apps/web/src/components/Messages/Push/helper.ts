import type { Profile, ProfileQuery, ProfileQueryVariables } from '@hey/lens';

import { LENSHUB_PROXY } from '@hey/data/constants';
import { ProfileDocument } from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
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

export const getLensProfile = async (profileId: string) => {
  const result = await apolloClient().query<
    ProfileQuery,
    ProfileQueryVariables
  >({
    query: ProfileDocument,
    variables: {
      request: {
        forProfileId: profileId
      }
    }
  });
  return result.data.profile as Profile;
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
