import type { Channel } from '@lenster/types/lenster';
import { featuredChannels } from 'src/store/app';

const getChannelByTag = (tag: string): Channel | undefined => {
  return featuredChannels().find(
    (channel: Channel) => channel.tags?.includes(tag)
  );
};

export default getChannelByTag;
