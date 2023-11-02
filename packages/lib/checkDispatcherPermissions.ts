import type { Profile } from '@hey/lens';

/**
 * Check if the user can use the lens manager or broadcast
 * @param profile The user's profile
 * @returns An object with the permissions
 */
const checkDispatcherPermissions = (
  profile: Profile | null
): {
  canUseSignless: boolean;
  isSponsored: boolean;
  canUseLensManager: boolean;
  canBroadcast: boolean;
} => {
  if (!profile) {
    return {
      canUseSignless: false,
      isSponsored: false,
      canUseLensManager: false,
      canBroadcast: false
    };
  }

  const canUseSignless = profile.signless;
  const isSponsored = profile.sponsor;
  const canUseLensManager = canUseSignless && isSponsored;
  const canBroadcast = isSponsored;

  return { canUseSignless, isSponsored, canUseLensManager, canBroadcast };
};

export default checkDispatcherPermissions;
