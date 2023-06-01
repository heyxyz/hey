import MetaTags from '@components/Common/MetaTags';
import { useDisconnectXmtp } from '@components/utils/hooks/useXmtpClient';
import { APP_NAME } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import toast from 'react-hot-toast';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { Button, Card, GridItemEight, GridItemFour, GridLayout } from 'ui';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';

const CleanupSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const disconnectXmtp = useDisconnectXmtp();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'cleanup' });
  });

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
                If you stuck with some issues, you can try to clean up the
                localstorage. This will remove all the data stored in your
                browser.
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
                <div className="lt-text-gray-500 text-xs font-bold">
                  <Trans>
                    Clean your posts or comments that are not indexed
                  </Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.TransactionStore)}>
                <Trans>Cleanup</Trans>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>
                  <Trans>Timeline settings</Trans>
                </b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  <Trans>Clean your timeline filter settings</Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.TimelineStore)}>
                <Trans>Cleanup</Trans>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>
                  <Trans>Direct message keys</Trans>
                </b>
                <div className="lt-text-gray-500 text-xs font-bold">
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
                <b>
                  <Trans>Feature flags cache</Trans>
                </b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  <Trans>Clean your feature flags cache</Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.FeaturesCache)}>
                <Trans>Cleanup</Trans>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b className="text-red-500">
                  <Trans>App settings</Trans>
                </b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  <Trans>Note: Cleaning will log you out</Trans>
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.LensterStore)}>
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
