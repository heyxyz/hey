import { mainnetLensTeamMembers } from './lens-members';

export enum FeatureFlag {
  TrendingWidget = 'trending-widget',
  GatedLocales = 'gated-locales',
  ForYou = 'for-you',
  WTF2 = 'wtf2',
  ExploreTags = 'explore-tags',
  Spaces = 'spaces',
  ZoraMint = 'zora-mint',
  NftLogin = 'nft-login'
}

export const featureFlags = [
  {
    key: FeatureFlag.TrendingWidget,
    enabledFor: []
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
  },
  {
    key: FeatureFlag.ZoraMint,
    enabledFor: ['0x0d']
  },
  {
    key: FeatureFlag.NftLogin,
    enabledFor: ['0x0d']
  }
];
