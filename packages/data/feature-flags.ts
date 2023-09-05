export enum FeatureFlag {
  Spaces = 'spaces'
}

export const featureFlags = [
  {
    key: FeatureFlag.Spaces,
    enabledFor: ['0x0d']
  }
];
