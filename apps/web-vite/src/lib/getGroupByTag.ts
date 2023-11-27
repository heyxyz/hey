import type { Group } from '@hey/types/hey';
import { hydrateFeaturedGroups } from '@persisted/useFeaturedGroupsStore';

const getGroupByTag = (tags: string[]): Group | undefined => {
  const { featuredGroups } = hydrateFeaturedGroups();
  for (const tag of tags) {
    const group = featuredGroups.find((group) => group.tags?.includes(tag));
    if (group) {
      return group;
    }
  }

  return undefined;
};

export default getGroupByTag;
