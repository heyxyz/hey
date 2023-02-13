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
  },
  {
    key: 'gated-locales',
    name: 'Gated locales',
    enabledFor: ['0x01adb7', '0x216f', '0x6b66', '0x6b15', '0x01adb3', ...lensterMembers, ...aaveMembers]
  }
];
