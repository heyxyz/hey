import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Interests from '@components/Settings/Interests/Interests';
import Beta from '@components/Shared/Badges/Beta';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@hey/ui';
import { useEffect } from 'react';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';

const InterestsSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'interests' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Interests settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardHeader
            body={`Interests you select are used to personalize your experience
            across ${APP_NAME}. You can adjust your interests if something
            doesn't look right.`}
            title={
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold">
                  Select profile interests
                </div>
                <Beta />
              </div>
            }
          />
          <Interests />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default InterestsSettings;
