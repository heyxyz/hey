export enum FeatureFlag {
  Spaces = 'spaces'
}

export const featureFlags = [
  {
    key: FeatureFlag.Spaces,
    enabledFor: ['0x0d', '0x016ae5', '0x0e63']
  }
];
