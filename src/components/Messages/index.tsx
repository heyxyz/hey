import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import Seo from '@components/utils/Seo';
import getFeatureEnabled from '@lib/getFeatureEnabled';
import { NextPage } from 'next';
import React from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

const Messages: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!getFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Messages • ${APP_NAME}`} />
      <GridItemFour>
        <div>gm</div>
      </GridItemFour>
      <GridItemEight>
        <div>gm</div>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
