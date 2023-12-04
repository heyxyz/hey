import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { PAGEVIEW } from '@hey/data/tracking';
import { Button, Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import toast from 'react-hot-toast';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';

const CleanupSettings: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'cleanup' });
  });

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
        <Card className="p-5">
          <div className="space-y-3">
            <div className="text-lg font-bold">Cleanup local storage</div>
            <p>
              If you stuck with some issues, you can try to clean up the
              browser's internal local storage. This will remove all the data
              stored in your browser.
            </p>
          </div>
          <div className="divider my-5" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Optimistic publications</b>
                <div className="ld-text-gray-500 text-xs font-bold">
                  Clean your posts or comments that are not indexed
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.TransactionStore)}>
                Cleanup
              </Button>
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
