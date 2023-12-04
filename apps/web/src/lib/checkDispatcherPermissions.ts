import type { Profile } from '@hey/lens';

import { hydrateTbaStatus } from 'src/store/persisted/useTbaStatusStore';

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
  isTba: boolean;
} => {
  const { isTba } = hydrateTbaStatus();

  if (!profile || isTba) {
    return {
      canBroadcast: false,
      canUseLensManager: false,
      canUseSignless: false,
      isSponsored: false,
      isTba
    };
  }

  const canUseSignless = profile.signless;
  const isSponsored = profile.sponsor;
  const canUseLensManager = canUseSignless && isSponsored;
  const canBroadcast = isSponsored;

  return {
    canBroadcast,
    canUseLensManager,
    canUseSignless,
    isSponsored,
    isTba
  };
};

export default checkDispatcherPermissions;
