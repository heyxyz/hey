import { prideHashtags } from './pride-hashtags';

export const hashflags: Record<string, string> = {
  lenster: 'lenster',
  lenstube: 'lenstube',
  bitcoin: 'bitcoin',
  btc: 'bitcoin',
  ethereum: 'ethereum',
  eth: 'ethereum',
  lens: 'lens',
  bts: 'bts',
  btsarmy: 'btsarmy',
  blm: 'blm',
  blacklivesmatter: 'blm',
  bhm: 'blm',
  voted: 'voted',
  hashtag: 'hashtag',
  bonsai: 'bonsai',
  ...prideHashtags.reduce((acc, cur) => ({ ...acc, [cur]: 'pride' }), {})
};
