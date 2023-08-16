import { mainnetLensTeamMembers } from './lens-members';

export enum FeatureFlag {
  TrendingWidget = 'trending-widget',
  NftGallery = 'nft-gallery',
  NftDetail = 'nft-detail',
  GatedLocales = 'gated-locales',
  ForYou = 'for-you',
  WTF2 = 'wtf2',
  ExploreTags = 'explore-tags',
  Spaces = 'spaces'
}

export const featureFlags = [
  {
    key: FeatureFlag.TrendingWidget,
    enabledFor: []
  },
  {
    key: FeatureFlag.NftGallery,
    enabledFor: ['0x0d', '0x014309']
  },
  {
    key: FeatureFlag.NftDetail,
    enabledFor: ['0x0d', '0x014309']
  },
  {
    key: FeatureFlag.GatedLocales,
    enabledFor: []
  },
  {
    key: FeatureFlag.ForYou,
    enabledFor: [...mainnetLensTeamMembers]
  },
  {
    key: FeatureFlag.WTF2,
    enabledFor: [...mainnetLensTeamMembers]
  },
  {
    key: FeatureFlag.ExploreTags,
    enabledFor: [...mainnetLensTeamMembers]
  },
  {
    key: FeatureFlag.Spaces,
    enabledFor: ['0x0d']
  }
];
