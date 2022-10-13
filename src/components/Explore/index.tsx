import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import Footer from '@components/Shared/Footer';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import { PublicationSortCriteria } from '@generated/types';
import { Tab } from '@headlessui/react';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import clsx from 'clsx';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { APP_NAME, STATIC_ASSETS } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Feed from './Feed';
import FeedType from './FeedType';

const Explore: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<any>();

  useEffect(() => {
    Leafwatch.track('Pageview', { path: PAGEVIEW.EXPLORE });
  }, []);

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
          <Tab.List className="border-b space-x-8">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                defaultChecked={index === 1}
                onClick={() => {
                  Leafwatch.track(`Switch to ${tab.type?.toLowerCase()} tab in explore`);
                }}
                className={({ selected }) =>
                  clsx(
                    { 'border-b-2 border-brand-500 !text-black': selected },
                    'px-4 pb-2 text-gray-500 outline-none font-medium text-sm'
                  )
                }
              >
                <span className="flex items-center space-x-2">
                  <span className="hidden sm:block">{tab.name}</span>
                  <img className="h-4" src={`${STATIC_ASSETS}/emojis/${tab.emoji}`} alt={tab.name} />
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
