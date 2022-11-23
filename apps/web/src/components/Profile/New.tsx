import Signup from '@components/Shared/Login/New';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import { APP_NAME } from 'data/constants';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

const NewProfile: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Create Profile • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper heading="Create profile" description="Create new decentralized profile" />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <Signup />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default NewProfile;
