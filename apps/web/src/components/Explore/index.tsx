import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { Tab } from '@headlessui/react';
import { APP_NAME } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import { EXPLORE, PAGEVIEW } from '@hey/data/tracking';
import type { PublicationMetadataMainFocusType } from '@hey/lens';
import { ExplorePublicationsOrderByType } from '@hey/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import cn from '@hey/ui/cn';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Explore: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();
  const searchParams = useSearchParams();
  const [tabIndex, setTabIndex] = useState(
    Number(searchParams.get('tab')) || 0
  );

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
        title={`Explore • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5">
        <Tab.Group defaultIndex={tabIndex} onChange={setTabIndex}>
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
                    'ld-text-gray-500 px-4 pb-2 text-xs font-medium outline-none sm:text-sm'
                  )
                }
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
        {isFeatureEnabled(FeatureFlag.LensMember) ? <Trending /> : null}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
