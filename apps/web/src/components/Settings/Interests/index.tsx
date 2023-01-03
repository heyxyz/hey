import MetaTags from '@components/Common/MetaTags';
import Interests from '@components/Settings/Interests/Interests';
import Beta from '@components/Shared/Badges/Beta';
import New from '@components/Shared/Badges/New';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import SettingsSidebar from '../Sidebar';

const InterestsSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Interests settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="space-y-5">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold">
                <Trans>Select profile interests</Trans>
              </div>
              <Beta />
              <New />
            </div>
            <p>
              <Trans>
                Interests you select are used to personalize your experience across Lenster. You can adjust
                your interests if something doesn't look right.
              </Trans>
            </p>
          </div>
          <div className="divider my-5" />
          <Interests />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default InterestsSettings;
