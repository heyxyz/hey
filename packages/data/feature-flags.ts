export enum FeatureFlag {
  LiveStream = 'live-stream'
}

export const featureFlags = [
  {
    key: FeatureFlag.LiveStream,
    enabledFor: ['0x98e0', '0x04']
  }
];
