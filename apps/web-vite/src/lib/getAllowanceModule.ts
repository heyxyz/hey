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
    case OpenActionModuleType.SimpleCollectOpenActionModule:
      return { name: 'Simple collect', field: 'openActionModule' };
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return { name: 'Multirecipient paid collect', field: 'openActionModule' };
    case OpenActionModuleType.LegacySimpleCollectModule:
      return { name: 'Legacy Simple collect', field: 'openActionModule' };
    case OpenActionModuleType.LegacyMultirecipientFeeCollectModule:
      return {
        name: 'Legacy Multirecipient paid collect',
        field: 'openActionModule'
      };

    // Follow modules
    case FollowModuleType.FeeFollowModule:
      return { name: 'Fee follow', field: 'followModule' };

    default:
      return { name, field: 'collectModule' };
  }
};

export default getAllowanceModule;
