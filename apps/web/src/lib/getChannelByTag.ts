import type { Channel } from '@lenster/types/lenster';
import { featuredChannels } from 'src/store/app';

const getChannelByTag = (tags: string[]): Channel | undefined => {
  for (const tag of tags) {
    const channel = featuredChannels().find(
      (channel) => channel.tags?.includes(tag)
    );
    if (channel) {
      return channel;
    }
  }

  return undefined;
};

export default getChannelByTag;
