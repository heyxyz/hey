import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';
import { mainnetStaffs } from './staffs';

export const featureFlags = [
  {
    key: 'trending-widget',
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'nft-gallery',
    name: 'NFT Gallery',
    enabledFor: [...lensterMembers, ...mainnetStaffs]
  },
  {
    key: 'preferences-settings',
    name: 'Preferences settings',
    enabledFor: [...lensterMembers, ...aaveMembers]
  }
];
