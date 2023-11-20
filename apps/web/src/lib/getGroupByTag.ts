import type { Group } from '@hey/types/hey';
import { featuredGroups } from 'src/store/non-persisted/useAppStore';

const getGroupByTag = (tags: string[]): Group | undefined => {
  for (const tag of tags) {
    const group = featuredGroups().find((group) => group.tags?.includes(tag));
    if (group) {
      return group;
    }
  }

  return undefined;
};

export default getGroupByTag;
