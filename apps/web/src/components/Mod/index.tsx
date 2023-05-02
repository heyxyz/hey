import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { Mixpanel } from '@lib/mixpanel';
import { t, Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import { CustomFiltersTypes, PublicationMainFocus, PublicationTypes } from 'lens';
import isGardener from 'lib/isGardener';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { Button, Card, Checkbox, GridItemEight, GridItemFour, GridLayout } from 'ui';

import Feed from './Feed';

const Mod: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [refresing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [publicationTypes, setPublicationTypes] = useState([PublicationTypes.Post, PublicationTypes.Comment]);
  const [mainContentFocus, setMainContentFocus] = useState<PublicationMainFocus[]>([
    PublicationMainFocus.Article,
    PublicationMainFocus.Audio,
    PublicationMainFocus.Embed,
    PublicationMainFocus.Image,
    PublicationMainFocus.Link,
    PublicationMainFocus.TextOnly,
    PublicationMainFocus.Video
  ]);
  const [customFilters, setCustomFilters] = useState([CustomFiltersTypes.Gardeners]);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'mod' });
  }, []);

  if (!isGardener(currentProfile?.id)) {
    return <Custom404 />;
  }

  const toggleMainContentFocus = (focus: PublicationMainFocus) => {
    if (mainContentFocus.includes(focus)) {
      setMainContentFocus(mainContentFocus.filter((type) => type !== focus));
    } else {
      setMainContentFocus([...mainContentFocus, focus]);
    }
  };

  const togglePublicationType = (publicationType: PublicationTypes) => {
    if (publicationTypes.includes(publicationType)) {
      setPublicationTypes(publicationTypes.filter((type) => type !== publicationType));
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
          <Button disabled={refresing} className="w-full" onClick={() => setRefresh(!refresh)}>
            <Trans>Refresh feed</Trans>
          </Button>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">
              <Trans>Publication filters</Trans>
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Checkbox
                onChange={() => togglePublicationType(PublicationTypes.Post)}
                checked={publicationTypes.includes(PublicationTypes.Post)}
                name="posts"
                label={t`Posts`}
              />
              <Checkbox
                onChange={() => togglePublicationType(PublicationTypes.Comment)}
                checked={publicationTypes.includes(PublicationTypes.Comment)}
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
                onChange={() => toggleMainContentFocus(PublicationMainFocus.Article)}
                checked={mainContentFocus.includes(PublicationMainFocus.Article)}
                name="articles"
                label={t`Articles`}
              />
              <Checkbox
                onChange={() => toggleMainContentFocus(PublicationMainFocus.Audio)}
                checked={mainContentFocus.includes(PublicationMainFocus.Audio)}
                name="audio"
                label={t`Audio`}
              />
              <Checkbox
                onChange={() => toggleMainContentFocus(PublicationMainFocus.Embed)}
                checked={mainContentFocus.includes(PublicationMainFocus.Embed)}
                name="embeds"
                label={t`Embeds`}
              />
              <Checkbox
                onChange={() => toggleMainContentFocus(PublicationMainFocus.Image)}
                checked={mainContentFocus.includes(PublicationMainFocus.Image)}
                name="images"
                label={t`Images`}
              />
              <Checkbox
                onChange={() => toggleMainContentFocus(PublicationMainFocus.Link)}
                checked={mainContentFocus.includes(PublicationMainFocus.Link)}
                name="links"
                label={t`Links`}
              />
              <Checkbox
                onChange={() => toggleMainContentFocus(PublicationMainFocus.TextOnly)}
                checked={mainContentFocus.includes(PublicationMainFocus.TextOnly)}
                name="text"
                label={t`Text`}
              />
              <Checkbox
                onChange={() => toggleMainContentFocus(PublicationMainFocus.Video)}
                checked={mainContentFocus.includes(PublicationMainFocus.Video)}
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
                  if (customFilters.includes(CustomFiltersTypes.Gardeners)) {
                    setCustomFilters(customFilters.filter((type) => type !== CustomFiltersTypes.Gardeners));
                  } else {
                    setCustomFilters([...customFilters, CustomFiltersTypes.Gardeners]);
                  }
                }}
                checked={customFilters.includes(CustomFiltersTypes.Gardeners)}
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
