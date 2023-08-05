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
    description: 'Recommended for you based on your interests',
    image: 'https://picsum.photos/300/300',
    by: 'Karma3Labs'
  },
  {
    name: 'K3L Popular',
    feedType: HomeFeedType.K3L_POPULAR,
    description: 'Popular in your network',
    image: 'https://picsum.photos/300/300',
    by: 'Karma3Labs'
  },
  {
    name: 'K3L Recent',
    feedType: HomeFeedType.K3L_RECENT,
    description: 'Recent in your network',
    image: 'https://picsum.photos/300/300',
    by: 'Karma3Labs'
  },
  {
    name: 'K3L Crowdsourced',
    feedType: HomeFeedType.K3L_CROWDSOURCED,
    description: 'Crowdsourced by your network',
    image: 'https://picsum.photos/300/300',
    by: 'Karma3Labs'
  }
];
