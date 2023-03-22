interface FollowModuleMap {
  [key: string]: string;
}

const followModuleMap: FollowModuleMap = {
  ProfileFollowModuleSettings: 'Only Lens profiles can follow',
  FeeFollowModuleSettings: 'Charge to follow',
  RevertFollowModuleSettings: 'No one can follow'
};

/**
 *
 * @param name Name to format
 * @returns formatted name
 */
const getFollowModule = (name: string): { description: string } => {
  const description = followModuleMap[name] ?? 'Anyone can follow';
  return { description };
};

export default getFollowModule;
