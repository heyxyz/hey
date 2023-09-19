import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { APP_NAME } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import {
  CustomFiltersType,
  PublicationMetadataMainFocusType,
  PublicationType
} from '@lenster/lens';
import {
  Button,
  Card,
  Checkbox,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import { usePreferencesStore } from 'src/store/preferences';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Mod: NextPage = () => {
  const isGardener = usePreferencesStore((state) => state.isGardener);
  const [refresing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [publicationTypes, setPublicationTypes] = useState([
    PublicationType.Post,
    PublicationType.Comment
  ]);
  const [mainContentFocus, setMainContentFocus] = useState<
    PublicationMetadataMainFocusType[]
  >([
    PublicationMetadataMainFocusType.Article,
    PublicationMetadataMainFocusType.Audio,
    PublicationMetadataMainFocusType.Embed,
    PublicationMetadataMainFocusType.Image,
    PublicationMetadataMainFocusType.Link,
    PublicationMetadataMainFocusType.TextOnly,
    PublicationMetadataMainFocusType.Video
  ]);
  const [customFilters, setCustomFilters] = useState([
    CustomFiltersType.Gardeners
  ]);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'mod' });
  });

  if (!isGardener) {
    return <Custom404 />;
  }

  const toggleMainContentFocus = (focus: PublicationMetadataMainFocusType) => {
    if (mainContentFocus.includes(focus)) {
      setMainContentFocus(mainContentFocus.filter((type) => type !== focus));
    } else {
      setMainContentFocus([...mainContentFocus, focus]);
    }
  };

  const togglePublicationType = (publicationType: PublicationType) => {
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
      <MetaTags title={t`Mod Center • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Feed
          refresh={refresh}
          setRefreshing={setRefreshing}
          publicationTypes={publicationTypes}
          mainContentFocus={mainContentFocus}
          customFilters={customFilters}
        />
      </GridItemEight>
      <GridItemFour>
        <Card className="p-5">
          <Button
            disabled={refresing}
            className="w-full"
            onClick={() => setRefresh(!refresh)}
          >
            <Trans>Refresh feed</Trans>
          </Button>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">
              <Trans>Publication filters</Trans>
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Checkbox
                onChange={() => togglePublicationType(PublicationType.Post)}
                checked={publicationTypes.includes(PublicationType.Post)}
                name="posts"
                label={t`Posts`}
              />
              <Checkbox
                onChange={() => togglePublicationType(PublicationType.Comment)}
                checked={publicationTypes.includes(PublicationType.Comment)}
                name="comments"
                label={t`Comments`}
              />
            </div>
          </div>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">
              <Trans>Media filters</Trans>
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Checkbox
                onChange={() =>
                  toggleMainContentFocus(
                    PublicationMetadataMainFocusType.Article
                  )
                }
                checked={mainContentFocus.includes(
                  PublicationMetadataMainFocusType.Article
                )}
                name="articles"
                label={t`Articles`}
              />
              <Checkbox
                onChange={() =>
                  toggleMainContentFocus(PublicationMetadataMainFocusType.Audio)
                }
                checked={mainContentFocus.includes(
                  PublicationMetadataMainFocusType.Audio
                )}
                name="audio"
                label={t`Audio`}
              />
              <Checkbox
                onChange={() =>
                  toggleMainContentFocus(PublicationMetadataMainFocusType.Embed)
                }
                checked={mainContentFocus.includes(
                  PublicationMetadataMainFocusType.Embed
                )}
                name="embeds"
                label={t`Embeds`}
              />
              <Checkbox
                onChange={() =>
                  toggleMainContentFocus(PublicationMetadataMainFocusType.Image)
                }
                checked={mainContentFocus.includes(
                  PublicationMetadataMainFocusType.Image
                )}
                name="images"
                label={t`Images`}
              />
              <Checkbox
                onChange={() =>
                  toggleMainContentFocus(PublicationMetadataMainFocusType.Link)
                }
                checked={mainContentFocus.includes(
                  PublicationMetadataMainFocusType.Link
                )}
                name="links"
                label={t`Links`}
              />
              <Checkbox
                onChange={() =>
                  toggleMainContentFocus(
                    PublicationMetadataMainFocusType.TextOnly
                  )
                }
                checked={mainContentFocus.includes(
                  PublicationMetadataMainFocusType.TextOnly
                )}
                name="text"
                label={t`Text`}
              />
              <Checkbox
                onChange={() =>
                  toggleMainContentFocus(PublicationMetadataMainFocusType.Video)
                }
                checked={mainContentFocus.includes(
                  PublicationMetadataMainFocusType.Video
                )}
                name="videos"
                label={t`Videos`}
              />
            </div>
          </div>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">
              <Trans>Custom filters</Trans>
            </span>
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
                label={t`Gardeners`}
              />
            </div>
          </div>
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Mod;
