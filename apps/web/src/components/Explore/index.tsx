import type { PublicationMetadataMainFocusType } from '@hey/lens';
import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/Sidebar/RecommendedProfiles';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { Tab } from '@headlessui/react';
import { APP_NAME } from '@hey/data/constants';
import { EXPLORE, PAGEVIEW } from '@hey/data/tracking';
import { ExplorePublicationsOrderByType } from '@hey/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Explore: NextPage = () => {
  const router = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'explore' });
  });

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
      <MetaTags
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
        title={`Explore • ${APP_NAME}`}
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
                className={({ selected }) =>
                  cn(
                    {
                      'border-brand-500 border-b-2 !text-black dark:!text-white':
                        selected
                    },
                    'ld-text-gray-500 px-4 pb-2 text-xs font-medium outline-none sm:text-sm'
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
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
