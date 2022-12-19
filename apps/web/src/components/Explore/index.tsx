import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import Footer from '@components/Shared/Footer';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Tab } from '@headlessui/react';
import { Analytics } from '@lib/analytics';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import clsx from 'clsx';
import { APP_NAME, STATIC_IMAGES_URL } from 'data/constants';
import { PublicationSortCriteria } from 'lens';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

import Feed from './Feed';
import FeedType from './FeedType';

const Explore: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<any>();

  const tabs = [
    { name: 'For you', emoji: 'leaf-fluttering-in-wind.png', type: PublicationSortCriteria.CuratedProfiles },
    { name: 'Popular', emoji: 'hundred-points.png', type: PublicationSortCriteria.TopCommented },
    { name: 'Trending', emoji: 'heart-on-fire.png', type: PublicationSortCriteria.TopCollected },
    { name: 'Interesting', emoji: 'hushed-face.png', type: PublicationSortCriteria.TopMirrored }
  ];

  return (
    <GridLayout>
      <MetaTags
        title={`Explore • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5">
        <Tab.Group>
          <Tab.List className="divider space-x-8">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                defaultChecked={index === 1}
                onClick={() => {
                  Analytics.track(`switch_to_${tab.type?.toLowerCase()}_tab_in_explore`);
                }}
                className={({ selected }) =>
                  clsx(
                    { 'border-b-2 border-brand-500 !text-black dark:!text-white': selected },
                    'px-4 pb-2 lt-text-gray-500 outline-none font-medium text-sm'
                  )
                }
              >
                <span className="flex items-center space-x-2">
                  <span className="hidden sm:block">{tab.name}</span>
                  <img className="h-4" src={`${STATIC_IMAGES_URL}/emojis/${tab.emoji}`} alt={tab.name} />
                </span>
              </Tab>
            ))}
          </Tab.List>
          <FeedType setFocus={setFocus} focus={focus} />
          <Tab.Panels>
            {tabs.map((tab, index) => (
              <Tab.Panel key={index}>
                <Feed focus={focus} feedType={tab.type} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </GridItemEight>
      <GridItemFour>
        {isFeatureEnabled('trending-widget', currentProfile?.id) && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
