import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { LimitType, useProfileActionHistoryQuery } from '@hey/lens';
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
import Actions from './Actions';

const ActionsSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'sessions' });
  });

  const { data, loading, error } = useProfileActionHistoryQuery({
    variables: { request: { limit: LimitType.Fifty } },
    skip: !currentProfile?.id
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Action History • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <div className="mx-5 mt-5">
            <div className="space-y-3">
              <div className="text-lg font-bold">Actions</div>
              <p>This is a list of actions on your account.</p>
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
            <Actions actions={data?.profileActionHistory?.items} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default ActionsSettings;
