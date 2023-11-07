import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import ProfileAnalytics from './ProfileAnalytics';

const Analytics: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'analytics' });
  });

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Analytics • ${APP_NAME}`} />
      <GridItemEight>
        <ProfileAnalytics />
      </GridItemEight>
      <GridItemFour>
        <Card className="p-5">
          <UserProfile profile={currentProfile} />
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Analytics;
