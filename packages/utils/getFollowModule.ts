interface FollowModuleMap {
  [key: string]: string;
}

const followModuleMap: FollowModuleMap = {
  ProfileFollowModuleSettings: 'Only Lens profiles can follow',
  FeeFollowModuleSettings: 'Charge to follow',
  RevertFollowModuleSettings: 'No one can follow'
};

/**
 * Get follow module description based on the given name.
 *
 * @param name - Name to format
 * @returns Object containing the formatted description
 */
const getFollowModule = (name: string): { description: string } => {
  const description = followModuleMap[name] ?? 'Anyone can follow';
  return { description };
};

export default getFollowModule;
