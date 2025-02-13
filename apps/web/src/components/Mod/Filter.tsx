import { apps as knownApps } from "@hey/data/apps";
import { MainContentFocus } from "@hey/indexer";
import { Button, Card, Checkbox } from "@hey/ui";
import type { FC } from "react";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

const FILTER_APPS = knownApps;

interface State {
  apps: null | string[];
  customFilters: CustomFiltersType[];
  mainContentFocus: MainContentFocus[];
  publicationTypes: ModExplorePublicationType[];
  refresh: boolean;
  refreshing: boolean;
  setApps: (apps: null | string[]) => void;
  setCustomFilters: (customFilters: CustomFiltersType[]) => void;
  setMainContentFocus: (mainContentFocus: MainContentFocus[]) => void;
  setPublicationTypes: (publicationTypes: ModExplorePublicationType[]) => void;
  setRefresh: (refresh: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
}

const store = create<State>((set) => ({
  apps: null,
  customFilters: [CustomFiltersType.Gardeners],
  mainContentFocus: Object.keys(MainContentFocus).map(
    (key) => MainContentFocus[key as keyof typeof MainContentFocus]
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

  const toggleMainContentFocus = (focus: MainContentFocus) => {
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
          <b>Publication filters</b>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
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
            <b>Media filters</b>
            <button
              className="text-xs underline"
              onClick={() => {
                mainContentFocus.length === Object.keys(MainContentFocus).length
                  ? setMainContentFocus([])
                  : setMainContentFocus(
                      Object.keys(MainContentFocus).map(
                        (key) =>
                          MainContentFocus[key as keyof typeof MainContentFocus]
                      )
                    );
              }}
              type="button"
            >
              {mainContentFocus.length === Object.keys(MainContentFocus).length
                ? "Unselect all"
                : "Select all"}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            {Object.keys(MainContentFocus).map((key) => (
              <Checkbox
                checked={mainContentFocus.includes(
                  MainContentFocus[key as keyof typeof MainContentFocus]
                )}
                key={key}
                label={key}
                name={key}
                onChange={() =>
                  toggleMainContentFocus(
                    MainContentFocus[key as keyof typeof MainContentFocus]
                  )
                }
              />
            ))}
          </div>
        </div>
        <div className="divider my-3" />
        <div className="space-y-2">
          <b>Custom filters</b>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
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
            <b>Known apps filter</b>
            <button
              className="text-xs underline"
              onClick={() => setApps([])}
              type="reset"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
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
