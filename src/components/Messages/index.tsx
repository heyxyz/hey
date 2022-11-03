import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import type { NextPage } from 'next';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import PreviewList from './PreviewList';

const NoConversationSelected = () => {
  return (
    <div className="text-center flex flex-col h-full">
      <div className="m-auto">
        <span className="text-5xl text-center">👋</span>
        <h3 className="text-lg mt-3 mb-2">Select a conversation</h3>
        <p className="max-w-xs text-md text-gray-500">
          Choose an existing conversation or create a new one to start messaging
        </p>
      </div>
    </div>
  );
};

const Messages: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={`Messages • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight className="sm:h-[76vh] md:h-[80vh] xl:h-[84vh] mb-0 md:col-span-8 lg:block md:hidden sm:hidden xs:hidden sm:mx-2 xs:mx-2">
        <Card className="h-full">
          <NoConversationSelected />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
