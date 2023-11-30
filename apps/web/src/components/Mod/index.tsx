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
import Custom404 from '@pages/404';
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const FILTER_APPS = knownApps;

const Mod = () => {
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
  const [apps, setApps] = useState<string[] | null>(null);

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
          refresh={refresh}
          setRefreshing={setRefreshing}
          publicationTypes={publicationTypes}
          mainContentFocus={mainContentFocus}
          customFilters={customFilters}
          apps={apps}
        />
      </GridItemEight>
      <GridItemFour>
        <Card className="p-5">
          <Button
            disabled={refresing}
            className="w-full"
            onClick={() => setRefresh(!refresh)}
          >
            Refresh feed
          </Button>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">Publication filters</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Checkbox
                onChange={() =>
                  togglePublicationType(ExplorePublicationType.Post)
                }
                checked={publicationTypes.includes(ExplorePublicationType.Post)}
                name="posts"
                label="Posts"
              />
              <Checkbox
                onChange={() =>
                  togglePublicationType(ExplorePublicationType.Quote)
                }
                checked={publicationTypes.includes(
                  ExplorePublicationType.Quote
                )}
                name="quotes"
                label="Quotes"
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
                  key={key}
                  onChange={() =>
                    toggleMainContentFocus(
                      PublicationMetadataMainFocusType[
                        key as keyof typeof PublicationMetadataMainFocusType
                      ]
                    )
                  }
                  checked={mainContentFocus.includes(
                    PublicationMetadataMainFocusType[
                      key as keyof typeof PublicationMetadataMainFocusType
                    ]
                  )}
                  name={key}
                  label={key}
                />
              ))}
            </div>
          </div>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">Custom filters</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Checkbox
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
                checked={customFilters.includes(CustomFiltersType.Gardeners)}
                name="gardeners"
                label="Gardeners"
              />
            </div>
          </div>
          <div className="divider my-3" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Known apps filter</span>
              <button className="text-xs underline" onClick={() => setApps([])}>
                Reset
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {FILTER_APPS.map((app) => (
                <Checkbox
                  key={app}
                  onChange={() => {
                    if (apps?.includes(app)) {
                      setApps(apps.filter((currentApp) => currentApp !== app));
                    } else {
                      setApps([...(apps || []), app]);
                    }
                  }}
                  checked={apps?.includes(app)}
                  name={app}
                  label={app}
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
