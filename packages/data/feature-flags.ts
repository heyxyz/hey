export enum FeatureFlag {
  GatedLocales = 'gated-locales',
  Spaces = 'spaces'
}

export const featureFlags = [
  {
    key: FeatureFlag.GatedLocales,
    enabledFor: []
  },
  {
    key: FeatureFlag.Spaces,
    enabledFor: ['0x0d']
  }
];
