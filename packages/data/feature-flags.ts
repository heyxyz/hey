import { aaveMembers } from './aave-members';
import { IS_PRODUCTION } from './constants';
import { lensterMembers } from './lenster-members';
import { mainnetStaffs, testnetStaffs } from './staffs';

export const featureFlags = [
  {
    key: 'trending-widget',
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'nft-gallery',
    name: 'NFT Gallery',
    enabledFor: !IS_PRODUCTION ? [...mainnetStaffs, ...testnetStaffs] : []
  },
  {
    key: 'nft-detail',
    name: 'NFT Detail Page',
    enabledFor: !IS_PRODUCTION ? [...mainnetStaffs, ...testnetStaffs] : []
  },
  {
    key: 'preferences-settings',
    name: 'Preferences settings',
    enabledFor: [...lensterMembers, ...aaveMembers]
  }
];
