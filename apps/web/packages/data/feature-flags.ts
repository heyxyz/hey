import { aaveMembers } from './aave-members';
import { IS_PRODUCTION } from './constants';
import { lineasterMembers } from './lineaster-members';
import { mainnetStaffs, testnetStaffs } from './staffs';

export enum FeatureFlag {
  TrendingWidget = 'trending-widget',
  NftGallery = 'nft-gallery',
  NftDetail = 'nft-detail',
  GatedLocales = 'gated-locales',
  PublicationAnalytics = 'publication-analytics'
}

export const featureFlags = [
  {
    key: FeatureFlag.TrendingWidget,
    name: 'Trending widget',
    enabledFor: [...lineasterMembers]
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
    enabledFor: [...lineasterMembers, ...aaveMembers]
  },
  {
    key: FeatureFlag.PublicationAnalytics,
    name: 'Publication Analytics',
    enabledFor: [...mainnetStaffs]
  }
];
