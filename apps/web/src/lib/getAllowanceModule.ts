import { CollectModules, FollowModules, ReferenceModules } from '@hey/lens';
import { t } from '@lingui/macro';

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
    case CollectModules.MultirecipientFeeCollectModule:
      return { name: t`Multirecipient paid collect`, field: 'collectModule' };
    case CollectModules.SimpleCollectModule:
      return { name: t`Basic collect`, field: 'collectModule' };
    case CollectModules.RevertCollectModule:
      return { name: t`No collect`, field: 'collectModule' };

    // Follow modules
    case FollowModules.FeeFollowModule:
      return { name: t`Fee follow`, field: 'followModule' };

    // Reference modules
    case ReferenceModules.FollowerOnlyReferenceModule:
      return { name: t`Follower only reference`, field: 'referenceModule' };
    default:
      return { name, field: 'collectModule' };
  }
};

export default getAllowanceModule;
