import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { Tab } from '@headlessui/react';
import { APP_NAME } from '@hey/data/constants';
import { EXPLORE, PAGEVIEW } from '@hey/data/tracking';
import type { PublicationMainFocus } from '@hey/lens';
import { PublicationSortCriteria } from '@hey/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Explore: NextPage = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isLensMember = usePreferencesStore((state) => state.isLensMember);
  const [focus, setFocus] = useState<PublicationMainFocus>();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'explore' });
  });

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
                  Leafwatch.track(EXPLORE.SWITCH_EXPLORE_FEED_TAB, {
                    explore_feed_type: tab.type.toLowerCase()
                  });
                }}
                className={({ selected }) =>
                  cn(
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
          <FeedFocusType focus={focus} setFocus={setFocus} />
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
        {isLensMember ? <Trending /> : null}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
