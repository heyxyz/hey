import MetaTags from '@components/Common/MetaTags';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { useDisconnectXmtp } from '@components/utils/hooks/useXmtpClient';
import { APP_NAME, LS_KEYS } from 'data/constants';
import type { NextPage } from 'next';
import toast from 'react-hot-toast';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import Sidebar from '../Sidebar';

const CleanupSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const disconnectXmtp = useDisconnectXmtp();

  if (!currentProfile) {
    return <Custom404 />;
  }

  const cleanup = (key: string) => {
    localStorage.removeItem(key);
    toast.success(`Cleared ${key}`);
  };

  return (
    <GridLayout>
      <MetaTags title={`Cleanup settings • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="space-y-5">
            <div className="text-lg font-bold">Cleanup Localstorage</div>
            <p>
              If you stuck with some issues, you can try to clean up the localstorage. This will remove all
              the data stored in your browser.
            </p>
          </div>
          <div className="divider my-5" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Optimistic publications</b>
                <div className="font-bold text-xs lt-text-gray-500">
                  Clean your posts or comments that are not indexed
                </div>
              </div>
              <Button onClick={() => cleanup(LS_KEYS.TRANSACTION_STORE)}>Cleanup</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Timeline settings</b>
                <div className="font-bold text-xs lt-text-gray-500">Clean your timeline filter settings</div>
              </div>
              <Button onClick={() => cleanup(LS_KEYS.TIMELINE_STORE)}>Cleanup</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Direct message keys</b>
                <div className="font-bold text-xs lt-text-gray-500">Clean your DM encryption key</div>
              </div>
              <Button
                onClick={() => {
                  disconnectXmtp();
                  toast.success('Cleared DM keys');
                }}
              >
                Cleanup
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b className="text-red-500">App settings</b>
                <div className="font-bold text-xs lt-text-gray-500">Note: Cleaning will log you out</div>
              </div>
              <Button onClick={() => cleanup(LS_KEYS.LENSTER_STORE)}>Cleanup</Button>
            </div>
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default CleanupSettings;
