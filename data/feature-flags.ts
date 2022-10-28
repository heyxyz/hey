import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';

export const featureFlags = [
  {
    key: 'messages',
    name: 'Messages',
    enabledFor: [
      ...lensterMembers,
      ...aaveMembers,
      '0x06', // wagmi.lens
      '0x2d', // sasicodes.lens
      '0xe248', // nick-molnar.lens
      '0x010e04', // elisealix22.lens
      '0x5cce', // saulmc.lens
      '0x014309', // iambhavya.lens
      '0x8539', // petermdenton.lens
      '0x013f9d', // shanemac.lens
      '0x015336', // jazzz.lens
      '0x010e75', // shash256.lens
      '0x010f89', // alohajha.lens
      '0x21ad', // galligan.lens
      '0x77bd', // filiptronicek.lens
      '0x016b0f', // prashantbagga.lens
      '0x016b21', // snormore.lens
      '0x016b23', // martink.lens
      '0x016b25', // adamalix.lens
      '0x016b24', // bhavyam.lens
      '0x016b0b', // xmtplabs.lens
      '0xf5ff' // anoopr.lens
    ]
  },
  {
    key: 'composer-v2',
    name: 'Composer v2',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'trending-widget',
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  }
];
