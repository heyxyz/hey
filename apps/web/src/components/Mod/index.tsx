import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { apps as knownApps } from '@hey/data/apps';
import { APP_NAME } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import { PAGEVIEW } from '@hey/data/tracking';
import {
  CustomFiltersType,
  ExplorePublicationType,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import {
  Button,
  Card,
  Checkbox,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const FILTER_APPS = knownApps;

const Mod: NextPage = () => {
  const [refresing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [publicationTypes, setPublicationTypes] = useState([
    ExplorePublicationType.Post,
    ExplorePublicationType.Quote
  ]);
  const [mainContentFocus, setMainContentFocus] = useState<
    PublicationMetadataMainFocusType[]
  >(
    Object.keys(PublicationMetadataMainFocusType).map(
      (key) =>
        PublicationMetadataMainFocusType[
          key as keyof typeof PublicationMetadataMainFocusType
        ]
    )
  );
  const [customFilters, setCustomFilters] = useState([
    CustomFiltersType.Gardeners
  ]);
  const [apps, setApps] = useState<null | string[]>(null);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'mod' });
  });

  if (!isFeatureEnabled(FeatureFlag.Gardener)) {
    return <Custom404 />;
  }

  const toggleMainContentFocus = (focus: PublicationMetadataMainFocusType) => {
    if (mainContentFocus.includes(focus)) {
      setMainContentFocus(mainContentFocus.filter((type) => type !== focus));
    } else {
      setMainContentFocus([...mainContentFocus, focus]);
    }
  };

  const togglePublicationType = (publicationType: ExplorePublicationType) => {
    if (publicationTypes.includes(publicationType)) {
      setPublicationTypes(
        publicationTypes.filter((type) => type !== publicationType)
      );
    } else {
      setPublicationTypes([...publicationTypes, publicationType]);
    }
  };

  return (
    <GridLayout>
      <MetaTags title={`Mod Center • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Feed
          apps={apps}
          customFilters={customFilters}
          mainContentFocus={mainContentFocus}
          publicationTypes={publicationTypes}
          refresh={refresh}
          setRefreshing={setRefreshing}
        />
      </GridItemEight>
      <GridItemFour>
        <Card className="p-5">
          <Button
            className="w-full"
            disabled={refresing}
            onClick={() => setRefresh(!refresh)}
          >
            Refresh feed
          </Button>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">Publication filters</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Checkbox
                checked={publicationTypes.includes(ExplorePublicationType.Post)}
                label="Posts"
                name="posts"
                onChange={() =>
                  togglePublicationType(ExplorePublicationType.Post)
                }
              />
              <Checkbox
                checked={publicationTypes.includes(
                  ExplorePublicationType.Quote
                )}
                label="Quotes"
                name="quotes"
                onChange={() =>
                  togglePublicationType(ExplorePublicationType.Quote)
                }
              />
            </div>
          </div>
          <div className="divider my-3" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Media filters</span>
              <button
                className="text-xs underline"
                onClick={() => {
                  mainContentFocus.length ===
                  Object.keys(PublicationMetadataMainFocusType).length
                    ? setMainContentFocus([])
                    : setMainContentFocus(
                        Object.keys(PublicationMetadataMainFocusType).map(
                          (key) =>
                            PublicationMetadataMainFocusType[
                              key as keyof typeof PublicationMetadataMainFocusType
                            ]
                        )
                      );
                }}
                type="button"
              >
                {mainContentFocus.length ===
                Object.keys(PublicationMetadataMainFocusType).length
                  ? 'Unselect all'
                  : 'Select all'}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {Object.keys(PublicationMetadataMainFocusType).map((key) => (
                <Checkbox
                  checked={mainContentFocus.includes(
                    PublicationMetadataMainFocusType[
                      key as keyof typeof PublicationMetadataMainFocusType
                    ]
                  )}
                  key={key}
                  label={key}
                  name={key}
                  onChange={() =>
                    toggleMainContentFocus(
                      PublicationMetadataMainFocusType[
                        key as keyof typeof PublicationMetadataMainFocusType
                      ]
                    )
                  }
                />
              ))}
            </div>
          </div>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">Custom filters</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Checkbox
                checked={customFilters.includes(CustomFiltersType.Gardeners)}
                label="Gardeners"
                name="gardeners"
                onChange={() => {
                  if (customFilters.includes(CustomFiltersType.Gardeners)) {
                    setCustomFilters(
                      customFilters.filter(
                        (type) => type !== CustomFiltersType.Gardeners
                      )
                    );
                  } else {
                    setCustomFilters([
                      ...customFilters,
                      CustomFiltersType.Gardeners
                    ]);
                  }
                }}
              />
            </div>
          </div>
          <div className="divider my-3" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Known apps filter</span>
              <button
                className="text-xs underline"
                onClick={() => setApps([])}
                type="reset"
              >
                Reset
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {FILTER_APPS.map((app) => (
                <Checkbox
                  checked={apps?.includes(app)}
                  key={app}
                  label={app}
                  name={app}
                  onChange={() => {
                    if (apps?.includes(app)) {
                      setApps(apps.filter((currentApp) => currentApp !== app));
                    } else {
                      setApps([...(apps || []), app]);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Mod;
