import type { PublicationMetadataMainFocusType } from '@hey/lens';
import type { NextPage } from 'next';

import WhoToFollow from '@components/Home/Sidebar/WhoToFollow';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { Tab } from '@headlessui/react';
import { EXPLORE, PAGEVIEW } from '@hey/data/tracking';
import { ExplorePublicationsOrderByType } from '@hey/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Feed from './Feed';

const Explore: NextPage = () => {
  const router = useRouter();
  const { currentProfile } = useProfileStore();
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'explore' });
  }, []);

  const tabs = [
    { name: 'For you', type: ExplorePublicationsOrderByType.LensCurated },
    { name: 'Popular', type: ExplorePublicationsOrderByType.TopCommented },
    {
      name: 'Trending',
      type: ExplorePublicationsOrderByType.TopCollectedOpenAction
    },
    { name: 'Interesting', type: ExplorePublicationsOrderByType.TopMirrored }
  ];

  return (
    <GridLayout>
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
                className={({ selected }) =>
                  cn(
                    { 'border-b-2 border-black dark:border-white': selected },
                    'px-4 pb-2 text-xs font-medium outline-none sm:text-sm'
                  )
                }
                defaultChecked={index === 1}
                key={tab.type}
                onClick={() => {
                  Leafwatch.track(EXPLORE.SWITCH_EXPLORE_FEED_TAB, {
                    explore_feed_type: tab.type.toLowerCase()
                  });
                }}
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <FeedFocusType focus={focus} setFocus={setFocus} />
          <Tab.Panels>
            {tabs.map((tab) => (
              <Tab.Panel key={tab.type}>
                <Feed feedType={tab.type} focus={focus} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </GridItemEight>
      <GridItemFour>
        {currentProfile ? <WhoToFollow /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
