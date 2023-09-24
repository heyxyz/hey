# Feature Flags

Lenster uses feature flags to control the visibility of new features. This allows us to release new features to a subset of users and gradually roll them out to everyone.

## Using a feature flag

### Add flag to `FeatureFlag` enum and `featureFlags` object

1. Go to `packages/data/feature-flags.ts`
2. Add a new entry to the `FeatureFlag` enum.
3. Add a new entry to the `featureFlags` object.

### In a component

```ts
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';

const isNewFeatureEnabled = isFeatureEnabled(FeatureFlag.NewFeature);

if (!isNewFeatureEnabled) {
  return null;
}

return <NewFeature />;
```
