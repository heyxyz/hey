import type { OpenActionModule } from '@hey/lens';

import { OpenActionModuleType } from '@hey/lens';

const getOpenActionModuleData = (
  module?: OpenActionModule
): {
  name: string;
} => {
  switch (module?.type) {
    case OpenActionModuleType.SimpleCollectOpenActionModule:
    case OpenActionModuleType.LegacySimpleCollectModule:
      return {
        name: 'Simple Collect'
      };
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
    case OpenActionModuleType.LegacyMultirecipientFeeCollectModule:
      return {
        name: 'Multirecipient Fee Collect'
      };
    default:
      return {
        name: 'Unknown Module'
      };
  }
};

export default getOpenActionModuleData;
