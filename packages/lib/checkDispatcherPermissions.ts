import type { Profile } from '@hey/lens';

/**
 * Check if the user can use the lens manager or broadcast
 * @param profile The user's profile
 * @returns An object with the permissions
 */
const checkDispatcherPermissions = (
  profile: null | Profile
): {
  canBroadcast: boolean;
  canUseLensManager: boolean;
  canUseSignless: boolean;
  isSponsored: boolean;
} => {
  if (!profile) {
    return {
      canBroadcast: false,
      canUseLensManager: false,
      canUseSignless: false,
      isSponsored: false
    };
  }

  const canUseSignless = profile.signless;
  const isSponsored = profile.sponsor;
  const canUseLensManager = canUseSignless && isSponsored;
  const canBroadcast = isSponsored;

  return { canBroadcast, canUseLensManager, canUseSignless, isSponsored };
};

export default checkDispatcherPermissions;
