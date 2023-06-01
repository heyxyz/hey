import { CollectModules, FollowModules, ReferenceModules } from '@lenster/lens';
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
      return { name: t`Multirecipient Paid Collect`, field: 'collectModule' };
    case CollectModules.SimpleCollectModule:
      return { name: t`Basic Collect`, field: 'collectModule' };
    case CollectModules.RevertCollectModule:
      return { name: t`No Collect`, field: 'collectModule' };

    // Follow modules
    case FollowModules.FeeFollowModule:
      return { name: t`Fee Follow`, field: 'followModule' };

    // Reference modules
    case ReferenceModules.FollowerOnlyReferenceModule:
      return { name: t`Follower Only Reference`, field: 'referenceModule' };
    default:
      return { name, field: 'collectModule' };
  }
};

export default getAllowanceModule;
