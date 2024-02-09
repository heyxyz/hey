export enum FeatureFlag {
  Flagged = 'flagged',
  Gardener = 'gardener',
  GardenerMode = 'gardener-mode',
  Staff = 'staff',
  StaffMode = 'staff-mode',
  Suspended = 'suspended',
  TrustedProfile = 'trusted-profile'
}

export enum KillSwitch {
  FourEverLand = '4everland',
  Invites = 'invites',
  Signup = 'signup'
}

export const enabledKillSwitches: KillSwitch[] = [
  KillSwitch.FourEverLand,
  KillSwitch.Invites
  // KillSwitch.Signup
];
