import MetaTags from '@components/Common/MetaTags';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { MESSAGING_PROVIDER } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';
import { PAGEVIEW } from 'src/tracking';
import { Card, GridItemEight, GridLayout } from 'ui';

import NoConversationSelected from './NoConversationSelected';
import PreviewList from './PreviewList';

const Messages: NextPage = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setChatProvider = useMessageStore((state) => state.setChatProvider);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'messages' });
  }, []);

  useEffect(() => {
    const path = router.pathname;
    if (path === '/messages') {
      router.push(`/messages/${MESSAGING_PROVIDER.PUSH}`);
      setChatProvider(MESSAGING_PROVIDER.PUSH);
    }
  }, [router, setChatProvider]);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={t`Messages • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight className="xs:hidden xs:mx-2 mb-0 sm:mx-2 sm:hidden sm:h-[76vh] md:col-span-8 md:hidden md:h-[80vh] lg:block xl:h-[84vh]">
        <Card className="h-full">
          <NoConversationSelected />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
