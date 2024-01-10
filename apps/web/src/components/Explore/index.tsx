import type { PublicationMetadataMainFocusType } from '@hey/lens';
import type { NextPage } from 'next';

import RecommendedProfiles from '@components/Home/Sidebar/RecommendedProfiles';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { EXPLORE, PAGEVIEW } from '@hey/data/tracking';
import { ExplorePublicationsOrderByType } from '@hey/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import * as Tabs from '@radix-ui/react-tabs';
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
      <GridItemEight className="space-y-5">
        <Tabs.Root
          onValueChange={(index) => {
            router.replace(
              { query: { ...router.query, tab: parseInt(index) } },
              undefined,
              { shallow: true }
            );
          }}
          value={`${Number(router.query.tab ?? 0)}`}
        >
          <Tabs.List className="divider space-x-8">
            {tabs.map((tab, index) => (
              <Tabs.Trigger
                className={
                  'ld-text-gray-500 data-[state=active]:border-brand-500 px-4 pb-2 text-xs font-medium outline-none data-[state=active]:border-b-2 data-[state=active]:!text-black sm:text-sm dark:data-[state=active]:!text-white'
                }
                key={tab.type}
                onClick={() => {
                  Leafwatch.track(EXPLORE.SWITCH_EXPLORE_FEED_TAB, {
                    explore_feed_type: tab.type.toLowerCase()
                  });
                }}
                value={`${index}`}
              >
                {tab.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <div className="mt-5">
            <FeedFocusType focus={focus} setFocus={setFocus} />
          </div>
          {tabs.map((tab, index) => (
            <Tabs.Content className="mt-5" key={tab.type} value={`${index}`}>
              <Feed feedType={tab.type} focus={focus} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </GridItemEight>
      <GridItemFour>
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
