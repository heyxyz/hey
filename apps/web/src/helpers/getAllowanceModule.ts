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
  field: string;
  name: string;
} => {
  switch (name) {
    // Collect Modules
    case OpenActionModuleType.SimpleCollectOpenActionModule:
      return { field: 'openActionModule', name: 'Simple collect' };
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return { field: 'openActionModule', name: 'Multirecipient paid collect' };
    case OpenActionModuleType.LegacySimpleCollectModule:
      return { field: 'openActionModule', name: 'Legacy Simple collect' };
    case OpenActionModuleType.LegacyMultirecipientFeeCollectModule:
      return {
        field: 'openActionModule',
        name: 'Legacy Multirecipient paid collect'
      };
    case OpenActionModuleType.LegacyFreeCollectModule:
      return { field: 'openActionModule', name: 'Legacy Free collect' };
    case OpenActionModuleType.LegacyFeeCollectModule:
      return { field: 'openActionModule', name: 'Legacy Fee collect' };
    case OpenActionModuleType.LegacyLimitedFeeCollectModule:
      return { field: 'openActionModule', name: 'Legacy Limited Fee collect' };
    case OpenActionModuleType.LegacyTimedFeeCollectModule:
      return { field: 'openActionModule', name: 'Legacy Timed Fee collect' };
    case OpenActionModuleType.LegacyLimitedTimedFeeCollectModule:
      return {
        field: 'openActionModule',
        name: 'Legacy Limited Timed Fee collect'
      };

    // Follow modules
    case FollowModuleType.FeeFollowModule:
      return { field: 'followModule', name: 'Fee follow' };

    default:
      return { field: 'collectModule', name };
  }
};

export default getAllowanceModule;
