import type { FC } from 'react';

import { apps as knownApps } from '@hey/data/apps';
import {
  CustomFiltersType,
  ModExplorePublicationType,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import { Button, Card, Checkbox } from '@hey/ui';
import { createTrackedSelector } from 'react-tracked';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { create } from 'zustand';

const FILTER_APPS = knownApps;

interface State {
  apps: null | string[];
  customFilters: CustomFiltersType[];
  mainContentFocus: PublicationMetadataMainFocusType[];
  publicationTypes: ModExplorePublicationType[];
  refresh: boolean;
  refreshing: boolean;
  setApps: (apps: null | string[]) => void;
  setCustomFilters: (customFilters: CustomFiltersType[]) => void;
  setMainContentFocus: (
    mainContentFocus: PublicationMetadataMainFocusType[]
  ) => void;
  setPublicationTypes: (publicationTypes: ModExplorePublicationType[]) => void;
  setRefresh: (refresh: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
}

const store = create<State>((set) => ({
  apps: null,
  customFilters: [CustomFiltersType.Gardeners],
  mainContentFocus: Object.keys(PublicationMetadataMainFocusType).map(
    (key) =>
      PublicationMetadataMainFocusType[
        key as keyof typeof PublicationMetadataMainFocusType
      ]
  ),
  publicationTypes: [
    ModExplorePublicationType.Post,
    ModExplorePublicationType.Quote,
    ModExplorePublicationType.Comment
  ],
  refresh: false,
  refreshing: false,
  setApps: (apps) => set(() => ({ apps })),
  setCustomFilters: (customFilters) => set(() => ({ customFilters })),
  setMainContentFocus: (mainContentFocus) => set(() => ({ mainContentFocus })),
  setPublicationTypes: (publicationTypes) => set(() => ({ publicationTypes })),
  setRefresh: (refresh) => set(() => ({ refresh })),
  setRefreshing: (refreshing) => set(() => ({ refreshing }))
}));

export const useModFilterStore = createTrackedSelector(store);

const Filter: FC = () => {
  const { gardenerMode } = useFeatureFlagsStore();
  const {
    apps,
    customFilters,
    mainContentFocus,
    publicationTypes,
    refresh,
    refreshing,
    setApps,
    setCustomFilters,
    setMainContentFocus,
    setPublicationTypes,
    setRefresh
  } = useModFilterStore();

  if (!gardenerMode) {
    return <Custom404 />;
  }

  const toggleMainContentFocus = (focus: PublicationMetadataMainFocusType) => {
    if (mainContentFocus.includes(focus)) {
      setMainContentFocus(mainContentFocus.filter((type) => type !== focus));
    } else {
      setMainContentFocus([...mainContentFocus, focus]);
    }
  };

  const togglePublicationType = (
    publicationType: ModExplorePublicationType
  ) => {
    if (publicationTypes.includes(publicationType)) {
      setPublicationTypes(
        publicationTypes.filter((type) => type !== publicationType)
      );
    } else {
      setPublicationTypes([...publicationTypes, publicationType]);
    }
  };

  return (
    <Card className="p-5">
      <>
        <Button
          className="w-full"
          disabled={refreshing}
          onClick={() => setRefresh(!refresh)}
        >
          Refresh feed
        </Button>
        <div className="divider my-3" />
        <div className="space-y-2">
          <span className="font-bold">Publication filters</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Checkbox
              checked={publicationTypes.includes(
                ModExplorePublicationType.Post
              )}
              label="Posts"
              name="posts"
              onChange={() =>
                togglePublicationType(ModExplorePublicationType.Post)
              }
            />
            <Checkbox
              checked={publicationTypes.includes(
                ModExplorePublicationType.Comment
              )}
              label="Comments"
              name="comments"
              onChange={() =>
                togglePublicationType(ModExplorePublicationType.Comment)
              }
            />
            <Checkbox
              checked={publicationTypes.includes(
                ModExplorePublicationType.Quote
              )}
              label="Quotes"
              name="quotes"
              onChange={() =>
                togglePublicationType(ModExplorePublicationType.Quote)
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
      </>
    </Card>
  );
};

export default Filter;
