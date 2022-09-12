import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import Signup from '@components/Shared/Navbar/Login/New';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { Card, CardBody } from '@components/UI/Card';
import Seo from '@components/utils/Seo';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

const NewProfile: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    Mixpanel.track('Pageview', { path: PAGEVIEW.CREATE_PROFILE });
  }, []);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Create Profile • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper heading="Create profile" description="Create new decentralized profile" />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody>
            <Signup />
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default NewProfile;
