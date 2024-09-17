import { FollowModuleType, OpenActionModuleType } from "@hey/lens";

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
      return { field: "openActionModule", name: "Simple collect" };
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return { field: "openActionModule", name: "Multirecipient paid collect" };
    // Follow modules
    case FollowModuleType.FeeFollowModule:
      return { field: "followModule", name: "Fee follow" };

    default:
      return { field: "collectModule", name };
  }
};

export default getAllowanceModule;
