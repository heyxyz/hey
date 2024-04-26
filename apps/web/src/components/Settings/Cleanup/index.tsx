import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { PAGEVIEW } from '@hey/data/tracking';
import {
  Button,
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@hey/ui';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

import SettingsSidebar from '../Sidebar';

const CleanupSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const { reset } = useTransactionStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'cleanup' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  const cleanup = (key: string) => {
    localStorage.removeItem(key);
    toast.success(`Cleared ${key}`);
  };

  return (
    <GridLayout>
      <MetaTags title={`Cleanup settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardHeader
            body="If you stuck with some issues, you can try to clean up the browser's internal local storage. This will remove all the data stored in your browser."
            title="Cleanup settings"
          />
          <div className="m-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Optimistic actions</b>
                <div className="ld-text-gray-500 text-xs font-bold">
                  Clean your posts, comments, follows, and other actions that
                  are still in the queue
                </div>
              </div>
              <Button onClick={reset}>Cleanup</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Timeline settings</b>
                <div className="ld-text-gray-500 text-xs font-bold">
                  Clean your timeline filter settings
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.TimelineStore)}>
                Cleanup
              </Button>
            </div>
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default CleanupSettings;
