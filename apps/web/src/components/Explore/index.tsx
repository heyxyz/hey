import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import Footer from '@components/Shared/Footer';
import { Tab } from '@headlessui/react';
import { Growthbook } from '@lib/growthbook';
import { Mixpanel } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { FeatureFlag } from 'data';
import { APP_NAME } from 'data/constants';
import type { PublicationMainFocus } from 'lens';
import { PublicationSortCriteria } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { EXPLORE, PAGEVIEW } from 'src/tracking';
import { GridItemEight, GridItemFour, GridLayout } from 'ui';

import Feed from './Feed';
import FeedType from './FeedType';

const Explore: NextPage = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMainFocus>();
  const { on: isTrendingWidgetEnabled } = Growthbook.feature(
    FeatureFlag.TrendingWidget
  );

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'explore' });
  }, []);

  const tabs = [
    { name: t`For you`, type: PublicationSortCriteria.CuratedProfiles },
    { name: t`Popular`, type: PublicationSortCriteria.TopCommented },
    { name: t`Trending`, type: PublicationSortCriteria.TopCollected },
    { name: t`Interesting`, type: PublicationSortCriteria.TopMirrored }
  ];

  return (
    <GridLayout>
      <MetaTags
        title={t`Explore • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5">
        <Tab.Group
          defaultIndex={Number(router.query.tab)}
          onChange={(index) => {
            router.replace(
              { query: { ...router.query, tab: index } },
              undefined,
              { shallow: true }
            );
          }}
        >
          <Tab.List className="divider space-x-8">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.type}
                defaultChecked={index === 1}
                onClick={() => {
                  Mixpanel.track(EXPLORE.SWITCH_EXPLORE_FEED_TAB, {
                    explore_feed_type: tab.type.toLowerCase()
                  });
                }}
                className={({ selected }) =>
                  clsx(
                    {
                      'border-brand-500 border-b-2 !text-black dark:!text-white':
                        selected
                    },
                    'lt-text-gray-500 px-4 pb-2 text-xs font-medium outline-none sm:text-sm'
                  )
                }
                data-testid={`explore-tab-${index}`}
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <FeedType setFocus={setFocus} focus={focus} />
          <Tab.Panels>
            {tabs.map((tab) => (
              <Tab.Panel key={tab.type}>
                <Feed focus={focus} feedType={tab.type} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </GridItemEight>
      <GridItemFour>
        {isTrendingWidgetEnabled && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
