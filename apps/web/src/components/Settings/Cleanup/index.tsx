import MetaTags from '@components/Common/MetaTags';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { useDisconnectXmtp } from '@components/utils/hooks/useXmtpClient';
import { t, Trans } from '@lingui/macro';
import { APP_NAME, LS_KEYS } from 'data/constants';
import type { NextPage } from 'next';
import toast from 'react-hot-toast';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import SettingsSidebar from '../Sidebar';

const CleanupSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const disconnectXmtp = useDisconnectXmtp();

  if (!currentProfile) {
    return <Custom404 />;
  }

  const cleanup = (key: string) => {
    localStorage.removeItem(key);
    toast.success(t`Cleared ${key}`);
  };

  return (
    <GridLayout>
      <MetaTags title={t`Cleanup settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="space-y-5">
            <div className="text-lg font-bold">
              <Trans>Cleanup Localstorage</Trans>
            </div>
            <p>
              <Trans>
                If you stuck with some issues, you can try to clean up the localstorage. This will remove all
                the data stored in your browser.
              </Trans>
            </p>
          </div>
          <div className="divider my-5" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>
                  <Trans>Optimistic publications</Trans>
                </b>
                <div className="font-bold text-xs lt-text-gray-500">
                  <Trans>Clean your posts or comments that are not indexed</Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(LS_KEYS.TRANSACTION_STORE)}>
                <Trans>Cleanup</Trans>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>
                  <Trans>Timeline settings</Trans>
                </b>
                <div className="font-bold text-xs lt-text-gray-500">
                  <Trans>Clean your timeline filter settings</Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(LS_KEYS.TIMELINE_STORE)}>
                <Trans>Cleanup</Trans>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>
                  <Trans>Direct message keys</Trans>
                </b>
                <div className="font-bold text-xs lt-text-gray-500">
                  <Trans>Clean your DM encryption key</Trans>
                </div>
              </div>
              <Button
                onClick={() => {
                  disconnectXmtp();
                  toast.success(t`Cleared DM keys`);
                }}
              >
                <Trans>Cleanup</Trans>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b className="text-red-500">
                  <Trans>App settings</Trans>
                </b>
                <div className="font-bold text-xs lt-text-gray-500">
                  <Trans>Note: Cleaning will log you out</Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(LS_KEYS.LENSTER_STORE)}>
                <Trans>Cleanup</Trans>
              </Button>
            </div>
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default CleanupSettings;
