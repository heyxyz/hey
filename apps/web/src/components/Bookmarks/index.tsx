import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/Sidebar/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import { PAGEVIEW } from '@hey/data/tracking';
import type { PublicationMetadataMainFocusType } from '@hey/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Bookmarks: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'bookmarks' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Bookmarks • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <FeedFocusType focus={focus} setFocus={setFocus} />
        <Feed focus={focus} />
      </GridItemEight>
      <GridItemFour>
        {isFeatureEnabled(FeatureFlag.LensMember) && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Bookmarks;
