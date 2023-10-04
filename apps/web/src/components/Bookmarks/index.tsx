import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import type { PublicationMainFocus } from '@hey/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Bookmarks: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMainFocus>();
  const isLensMember = usePreferencesStore((state) => state.isLensMember);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'bookmarks' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Bookmarks • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <FeedFocusType focus={focus} setFocus={setFocus} />
        <Feed focus={focus} />
      </GridItemEight>
      <GridItemFour>
        {isLensMember && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Bookmarks;
