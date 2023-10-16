import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import { LimitType, useWhoHaveBlockedQuery } from '@hey/lens';
import {
  Card,
  ErrorMessage,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import List from './List';

const BlockedSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'blocked' });
  });

  const { data, loading, error } = useWhoHaveBlockedQuery({
    variables: { request: { limit: LimitType.Fifty } },
    skip: !currentProfile?.id
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Blocked profiles • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <div className="mx-5 mt-5">
            <div className="space-y-3">
              <div className="text-lg font-bold">Blocked profiles</div>
              <p>
                This is a list of blocked profiles. You can unblock them at any
                time.
              </p>
            </div>
            <div className="divider my-5" />
          </div>
          {loading ? (
            <div className="py-5">
              <Loader />
            </div>
          ) : error ? (
            <ErrorMessage className="m-5" error={error} />
          ) : (
            <List profiles={data?.whoHaveBlocked?.items as Profile[]} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default BlockedSettings;
