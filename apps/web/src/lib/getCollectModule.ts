import { t } from '@lingui/macro';
import type { CollectModule } from 'lens';
import { CollectModules } from 'lens';

/**
 * Returns the name and field of the specified module.
 *
 * @param name Name of the module.
 * @returns Object containing the name and field of the module.
 */
const getCollectModule = (
  collectModule: CollectModule
): {
  name: string;
} => {
  switch (true) {
    case collectModule.type === CollectModules.RevertCollectModule:
      return { name: t`No Collect` };
    case collectModule.type === CollectModules.MultirecipientFeeCollectModule:
      return { name: t`Multirecipient Paid Collect` };
    default:
      return { name: 'gm' };
  }
};

export default getCollectModule;
