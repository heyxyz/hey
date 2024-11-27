import type { MeResult } from "@hey/indexer";

interface Permissions {
  canUseLensManager: boolean;
  canUseSignless: boolean;
}

/**
 * Determines the permissions for social operations based on the account.
 * @param account The user account
 * @returns An object containing the permissions
 */
const checkDispatcherPermissions = (account: MeResult | null): Permissions => {
  if (!account) {
    return {
      canUseLensManager: false,
      canUseSignless: false
    };
  }

  const { isSignless, isSponsored } = account;

  return {
    canUseLensManager: isSignless && isSponsored,
    canUseSignless: isSignless
  };
};

export default checkDispatcherPermissions;
