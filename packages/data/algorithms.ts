import { STATIC_IMAGES_URL } from './constants';
import { HomeFeedType } from './enums';

export const algorithms: {
  name: string;
  feedType: HomeFeedType;
  description: string;
  image: string;
  by: string;
}[] = [
  {
    name: 'K3L Recommended',
    feedType: HomeFeedType.K3L_RECOMMENDED,
    description: 'New and interesting content powered by AI + EigenTrust.',
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    by: 'Karma3Labs'
  },
  {
    name: 'K3L Popular',
    feedType: HomeFeedType.K3L_POPULAR,
    description: 'Posts sorted by top ranked profiles engagement.',
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    by: 'Karma3Labs'
  },
  {
    name: 'K3L Recent',
    feedType: HomeFeedType.K3L_RECENT,
    description: 'Recent posts sorted by time of posting.',
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    by: 'Karma3Labs'
  },
  {
    name: 'K3L Crowdsourced',
    feedType: HomeFeedType.K3L_CROWDSOURCED,
    description:
      'Posts that garnered much interest interactions weighted by the reputation of the interacting parties.',
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    by: 'Karma3Labs'
  }
];
