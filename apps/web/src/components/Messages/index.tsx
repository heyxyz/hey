import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import Custom404 from 'src/pages/404';

import Chat from './Chat';
import Conversations from './Conversations';

const Messages: NextPage = () => {
  if (isFeatureEnabled('dm')) {
    return <Custom404 />;
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-0 sm:px-5">
      <div className="grid grid-cols-12">
        <MetaTags title={`Messages • ${APP_NAME}`} />
        <Conversations />
        <Chat />
      </div>
    </div>
  );
};

export default Messages;
