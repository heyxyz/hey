import { t } from '@lingui/macro';
import { CollectModules, FollowModules, ReferenceModules } from 'lens';

/**
 *
 * @param name - Module to format
 * @returns module config
 */
export const getModule = (
  name: string
): {
  name: string;
  field: string;
  helper: string;
} => {
  switch (name) {
    // Collect Modules
    case CollectModules.UnknownCollectModule:
      return {
        name: t`Unknown Collect`,
        field: 'collectModule',
        helper: t`The Unknown Collect Module is unknown and not type supported in the API.`
      };
    case CollectModules.FeeCollectModule:
      return {
        name: t`Fee Collect`,
        field: 'collectModule',
        helper: t`The Fee Collect Module allows for any follower to collect the associated publication provided they pay a fee set by the poster.`
      };
    case CollectModules.LimitedFeeCollectModule:
      return {
        name: t`Limited Fee Collect`,
        field: 'collectModule',
        helper: t`The Limited Fee Collect Module allows for any follower to collect the associated publication, provided they pay a fee, up to a specific limit of mints.`
      };
    case CollectModules.TimedFeeCollectModule:
      return {
        name: t`Timed Fee Collect`,
        field: 'collectModule',
        helper: t`The Timed Fee Collect Module allows for any follower to collect the associated publication, provided they pay a fee, up to a specific time limit. The present whitelisted Timed Fee Collect module only has a 24-hour time limit to reduce gas usage and optimize efficiency.`
      };
    case CollectModules.LimitedTimedFeeCollectModule:
      return {
        name: t`Limited Time Fee Collect`,
        field: 'collectModule',
        helper: t`The Limited Timed Fee Collect Module allows for any follower to collect the associate publication, provided they pay a fee, up to a specific time limit and mint cap. It is essentially a combination of the Timed Fee Collect Module and the Limited Fee Collect Module.`
      };
    case CollectModules.FreeCollectModule:
      return {
        name: t`Free Collect`,
        field: 'collectModule',
        helper: t`The Free Collect Module allows any profile to collect the publication this module is attached to.`
      };
    case CollectModules.RevertCollectModule:
      return {
        name: t`Revert Collect`,
        field: 'collectModule',
        helper: t`The Revert Collect Module causes all collect actions on a given publication to fail, thus making the publication uncollectable.`
      };

    // Follow modules
    case FollowModules.FeeFollowModule:
      return {
        name: t`Fee Follow`,
        field: 'followModule',
        helper: t`The Fee Follow Module only allows addresses to follow a given profile, so long as they pay a fee specified by the profile owner. Users can set the currency and amount required to be paid.`
      };

    // Reference modules
    case ReferenceModules.FollowerOnlyReferenceModule:
      return {
        name: t`Follower Only Reference`,
        field: 'referenceModule',
        helper: t`The Follower Only Reference Module ensures that only a profile is only allowed to mirror or comment on content.`
      };
    default:
      return { name: name, field: 'collectModule', helper: 'Others' };
  }
};
