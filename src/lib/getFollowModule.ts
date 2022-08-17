/**
 *
 * @param name - Name to format
 * @returns formatted name
 */
export const getFollowModule = (name: string | undefined): { description: string } => {
  switch (name) {
    case 'ProfileFollowModuleSettings':
      return { description: 'Only Lens profiles can follow' };
    case 'FeeFollowModuleSettings':
      return { description: 'Charge to follow' };
    case 'RevertFollowModuleSettings':
      return { description: 'No one can follow' };
    default:
      return { description: 'Anyone can follow' };
  }
};
