import { FollowModuleType, OpenActionModuleType } from '@hey/lens';

/**
 * Returns the name and field of the specified module.
 *
 * @param name Name of the module.
 * @returns Object containing the name and field of the module.
 */
const getAllowanceModule = (
  name: string
): {
  name: string;
  field: string;
} => {
  switch (name) {
    // Collect Modules
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return { name: 'Multirecipient paid collect', field: 'collectModule' };
    case OpenActionModuleType.SimpleCollectOpenActionModule:
      return { name: 'Basic collect', field: 'collectModule' };

    // Follow modules
    case FollowModuleType.FeeFollowModule:
      return { name: 'Fee follow', field: 'followModule' };

    default:
      return { name, field: 'collectModule' };
  }
};

export default getAllowanceModule;
