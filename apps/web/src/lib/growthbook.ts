import { GrowthBook } from '@growthbook/growthbook';
import { GROWTHBOOK_KEY, IS_PRODUCTION } from '@lenster/data';

const growthbook = new GrowthBook({
  clientKey: GROWTHBOOK_KEY,
  enableDevMode: !IS_PRODUCTION
});

export const Growthbook = {
  init: async () => {
    await growthbook.loadFeatures({ autoRefresh: true });
  },
  setAttributes: (attributes: Record<string, any>) => {
    growthbook.setAttributes(attributes);
  },
  feature: (feature: string) => {
    return { on: growthbook.isOn(feature) };
  }
};
