import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { FeatureFlag } from '@lenster/data';
import { APP_NAME } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import type { PublicationMainFocus } from '@lenster/lens';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Bookmarks: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMainFocus>();
  const isTrendingWidgetEnabled = isFeatureEnabled(FeatureFlag.TrendingWidget);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'bookmarks' });
  });

  return (
    <GridLayout>
      <MetaTags title={t`Bookmarks • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <FeedFocusType setFocus={setFocus} focus={focus} />
        <Feed focus={focus} />
      </GridItemEight>
      <GridItemFour>
        {isTrendingWidgetEnabled && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Bookmarks;
