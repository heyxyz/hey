import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { LimitType, useApprovedAuthenticationsQuery } from '@hey/lens';
import {
  Card,
  EmptyState,
  ErrorMessage,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import Sessions from './Sessions';

const SessionsSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'sessions' });
  });

  const { data, loading, error } = useApprovedAuthenticationsQuery({
    variables: { request: { limit: LimitType.Fifty } },
    skip: !currentProfile?.id
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  const approvedAuthentications = data?.approvedAuthentications?.items || [];

  return (
    <GridLayout>
      <MetaTags title={`Sessions settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <div className="mx-5 mt-5">
            <div className="space-y-3">
              <div className="text-lg font-bold">Sessions</div>
              <p>
                This is a list of devices that have logged into your account.
                Revoke any sessions that you do not recognize.
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
          ) : approvedAuthentications.length < 1 ? (
            <EmptyState
              message="You are not logged in on any other devices!"
              icon={<GlobeAltIcon className="text-brand h-8 w-8" />}
              hideCard
            />
          ) : (
            <Sessions sessions={approvedAuthentications} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default SessionsSettings;
