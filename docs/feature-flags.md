# Feature Flags

Lenster uses [GrowthBook](https://growthbook.io/) for feature flags. GrowthBook is a open-source feature flagging and A/B testing library.

## Creating a feature flag _(only admins)_

1. Go to the [GrowthBook dashboard](https://app.growthbook.io/features).
2. Click the **Add Feature** button.
3. Enter a feature key for the feature flag.
4. Enter a description for the feature flag.
5. Add tags to the feature flag. Tags are used to group related feature flags together.
6. Click the **Create** button.

## Using a feature flag

### Add flag to `FeatureFlag` enum

1. Go to `packages/data/feature-flags.ts`
2. Add a new entry to the `FeatureFlag` enum.

### In a component

```ts
import { Growthbook } from '@lib/growthbook';

const { on: isNewFeatureEnabled } = Growthbook.feature(FeatureFlag.NewFeature);

if (!NewFeature) {
  return null;
}

return <NewFeature />;
```
