import type { Group } from '@hey/types/hey';

import { hydrateFeaturedGroups } from 'src/store/persisted/useFeaturedGroupsStore';

/**
 * Get group by tag
 * @param tags Tags
 * @returns Group
 */
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
