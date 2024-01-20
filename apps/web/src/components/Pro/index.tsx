import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME, Stripe } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridLayout } from '@hey/ui';
import { GridItemTwelve } from '@hey/ui/src/GridLayout';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import Plan from './Plan';

const Pro: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'pro' });
  });

  if (!currentProfile || !isFeatureEnabled('pro')) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Pro • ${APP_NAME}`} />
      <GridItemTwelve>
        <Card className="flex w-full items-center justify-between space-x-5 p-5">
          <Plan
            buttonText="Get Pro"
            description="Hey is free for everyone. If you want to support us, you can subscribe to Hey Pro and get some extra features."
            duration="month"
            features={[
              'Pro badge on profile',
              'Support an independent team',
              'Choose Algorithms',
              'See the feed through any user',
              'Custom app icon',
              'Enable tips on publications',
              'Profile analytics and stats'
            ]}
            name="Pro"
            planId={Stripe.PRO}
            price={5}
          />
          <Plan
            buttonText="Get Believer"
            description="Hey is free for everyone. If you want to support us, you can subscribe to Hey Pro and get some extra features."
            duration="year"
            features={[
              'Pro badge on profile',
              'Support an independent team',
              'Choose Algorithms',
              'See the feed through any user',
              'Custom app icon',
              'Enable tips on publications',
              'Profile analytics and stats'
            ]}
            name="Believer"
            planId={Stripe.BELIEVER}
            price={69}
          />
        </Card>
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Pro;
