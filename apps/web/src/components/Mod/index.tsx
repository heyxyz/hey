import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { Mixpanel } from '@lib/mixpanel';
import { t, Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import { CustomFiltersTypes, PublicationTypes } from 'lens';
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
  const [customFilters, setCustomFilters] = useState([CustomFiltersTypes.Gardeners]);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'mod' });
  }, []);

  if (!isGardener(currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Mod Center • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Feed
          refresh={refresh}
          setRefreshing={setRefreshing}
          publicationTypes={publicationTypes}
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
            <div className="flex items-center space-x-5">
              <Checkbox
                onChange={() => {
                  if (publicationTypes.includes(PublicationTypes.Post)) {
                    setPublicationTypes(publicationTypes.filter((type) => type !== PublicationTypes.Post));
                  } else {
                    setPublicationTypes([...publicationTypes, PublicationTypes.Post]);
                  }
                }}
                checked={publicationTypes.includes(PublicationTypes.Post)}
                name="posts"
                label={t`Posts`}
              />
              <Checkbox
                onChange={() => {
                  if (publicationTypes.includes(PublicationTypes.Comment)) {
                    setPublicationTypes(publicationTypes.filter((type) => type !== PublicationTypes.Comment));
                  } else {
                    setPublicationTypes([...publicationTypes, PublicationTypes.Comment]);
                  }
                }}
                checked={publicationTypes.includes(PublicationTypes.Comment)}
                name="comments"
                label={t`Comments`}
              />
            </div>
          </div>
          <div className="divider my-3" />
          <div className="space-y-2">
            <span className="font-bold">
              <Trans>Custom filters</Trans>
            </span>
            <div>
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
