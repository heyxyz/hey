import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { NextPage } from 'next';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import PreviewList from './PreviewList';

const Messages: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={`Messages • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight className="sm:h-[76vh] md:h-[80vh] xl:h-[84vh] mb-0 md:col-span-8 md:block sm:hidden xs:hidden sm:mx-2 xs:mx-2">
        <Card className="h-full">
          <div />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
