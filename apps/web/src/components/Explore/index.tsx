import type { PublicationMetadataMainFocusType } from '@good/lens';
import type { NextPage } from 'next';

import WhoToFollow from '@components/Home/Sidebar/WhoToFollow';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { EXPLORE, PAGEVIEW } from '@good/data/tracking';
import { ExplorePublicationsOrderByType } from '@good/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@good/ui';
import cn from '@good/ui/cn';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Leafwatch } from '@helpers/leafwatch';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
        <TabGroup
          defaultIndex={Number(router.query.tab)}
          onChange={(index) => {
            router.replace(
              { query: { ...router.query, tab: index } },
              undefined,
              { shallow: true }
            );
          }}
        >
          <TabList className="divider space-x-8">
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
          </TabList>
          <FeedFocusType focus={focus} setFocus={setFocus} />
          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={tab.type}>
                <Feed feedType={tab.type} focus={focus} />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </GridItemEight>
      <GridItemFour>
        {currentProfile ? <WhoToFollow /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
