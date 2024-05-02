interface FollowModule {
  description: string;
}

const FOLLOW_MODULE_MAP: Record<string, FollowModule> = {
  FeeFollowModuleSettings: { description: 'Charge to follow' },
  ProfileFollowModuleSettings: { description: 'Only Lens profiles can follow' },
  RevertFollowModuleSettings: { description: 'No one can follow' }
};

/**
 * Returns a follow module object for a given module name.
 *
 * @param name The name of the module.
 * @returns The follow module object.
 */
const getFollowModule = (name?: string): FollowModule => {
  return FOLLOW_MODULE_MAP[name || ''] || { description: 'Anyone can follow' };
};

export default getFollowModule;
