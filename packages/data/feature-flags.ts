import { aaveMembers } from './aave-members';
import { IS_DEVELOPMENT } from './constants';
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
    enabledFor: IS_DEVELOPMENT ? [...mainnetStaffs, ...testnetStaffs] : []
  },
  {
    key: 'nft-detail',
    name: 'NFT Detail Page',
    enabledFor: IS_DEVELOPMENT ? [...mainnetStaffs, ...testnetStaffs] : []
  },
  {
    key: 'preferences-settings',
    name: 'Preferences settings',
    enabledFor: [...lensterMembers, ...aaveMembers]
  }
];
