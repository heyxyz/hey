import { FREE_COLLECT_MODULE } from 'src/constants';

export const getModule = (
  name: string
): {
  name: string;
  hasParam?: boolean;
  config?: any;
  type: string;
  helper: string;
} => {
  switch (name) {
    // Collect Modules
    case 'FeeCollectModule':
      return {
        name: 'Fee Collect',
        hasParam: true,
        config: 'feeCollectModule',
        type: 'collectModule',
        helper:
          'The Fee Collect Module allows for any follower to collect the associated publication provided they pay a fee set by the poster.'
      };
    case 'LimitedFeeCollectModule':
      return {
        name: 'Limited Fee Collect',
        hasParam: true,
        config: 'limitedFeeCollectModule',
        type: 'collectModule',
        helper:
          'The Limited Fee Collect Module allows for any follower to collect the associated publication, provided they pay a fee, up to a specific limit of mints.'
      };
    case 'TimedFeeCollectModule':
      return {
        name: 'Timed Fee Collect',
        hasParam: true,
        config: 'timedFeeCollectModule',
        type: 'collectModule',
        helper:
          'The Timed Fee Collect Module allows for any follower to collect the associated publication, provided they pay a fee, up to a specific time limit. The present whitelisted Timed Fee Collect module only has a 24-hour time limit to reduce gas usage and optimize efficiency.'
      };
    case 'LimitedTimedFeeCollectModule':
      return {
        name: 'Limited Time Fee Collect',
        hasParam: true,
        config: 'limitedTimedFeeCollectModule',
        type: 'collectModule',
        helper:
          'The Limited Timed Fee Collect Module allows for any follower to collect the associate publication, provided they pay a fee, up to a specific time limit and mint cap. It is essentially a combination of the Timed Fee Collect Module and the Limited Fee Collect Module.'
      };
    case 'FreeCollectModule':
      return {
        name: 'Free Collect',
        hasParam: false,
        config: {
          freeCollectModule: { followerOnly: false }
        },
        type: 'collectModule',
        helper:
          'The Free Collect Module allows any profile to collect the publication this module is attached to.'
      };
    case 'RevertCollectModule':
      return {
        name: 'Revert Collect',
        hasParam: false,
        config: {
          revertCollectModule: true
        },
        type: 'collectModule',
        helper:
          'The Revert Collect Module causes all collect actions on a given publication to fail, thus making the publication uncollectible.'
      };

    // Follow modules
    case 'FeeFollowModule':
      return {
        name: 'Fee Follow',
        type: 'followModule',
        helper:
          'The Fee Follow Module only allows addresses to follow a given profile, so long as they pay a fee specified by the profile owner. Users can set the currency and amount required to be paid.'
      };

    // Reference modules
    case 'FollowerOnlyReferenceModule':
      return {
        name: 'Follower Only Reference',
        type: 'referenceModule',
        helper:
          'The Follower Only Reference Module ensures that only a profile is only allowed to mirror or comment on content.'
      };
    default:
      return { name: name, type: 'collectModule', helper: 'Others' };
  }
};

export type FEE_DATA_TYPE = {
  amount: { currency: string; value: string };
  collectLimit: string | null;
  recipient: string;
  referralFee: number;
  followerOnly: boolean;
};

export const defaultModuleData = {
  moduleName: 'FreeCollectModule',
  contractAddress: FREE_COLLECT_MODULE,
  inputParams: [],
  redeemParams: [],
  returnDataParms: []
};

export const defaultFeeData = {
  amount: { currency: '', value: '' },
  collectLimit: '',
  recipient: '',
  referralFee: 0,
  followerOnly: false
};
