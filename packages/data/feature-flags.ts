import { aaveMembers } from './aave-members';
import { IS_PRODUCTION } from './constants';
import { lensterMembers } from './lenster-members';
import { mainnetStaffs, testnetStaffs } from './staffs';

export enum FeatureFlag {
  TrendingWidget = 'trending-widget',
  NftGallery = 'nft-gallery',
  NftDetail = 'nft-detail',
  GatedLocales = 'gated-locales',
  PublicationAnalytics = 'publication-analytics',
  SnapshotVoting = 'snapshot-voting'
}

export const featureFlags = [
  {
    key: FeatureFlag.TrendingWidget,
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  },
  {
    key: FeatureFlag.NftGallery,
    name: 'NFT Gallery',
    enabledFor: !IS_PRODUCTION ? [...mainnetStaffs, ...testnetStaffs] : []
  },
  {
    key: FeatureFlag.NftDetail,
    name: 'NFT Detail Page',
    enabledFor: !IS_PRODUCTION ? [...mainnetStaffs, ...testnetStaffs] : []
  },
  {
    key: FeatureFlag.GatedLocales,
    name: 'Gated locales',
    enabledFor: ['0x01adb7', '0x216f', '0x6b66', '0x6b15', '0x01adb3', ...lensterMembers, ...aaveMembers]
  },
  {
    key: FeatureFlag.PublicationAnalytics,
    name: 'Publication Analytics',
    enabledFor: [...mainnetStaffs]
  },
  {
    key: FeatureFlag.SnapshotVoting,
    name: 'Snapshot Voting',
    enabledFor: [...mainnetStaffs]
  }
];
