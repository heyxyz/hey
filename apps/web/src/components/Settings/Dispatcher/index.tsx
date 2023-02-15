import MetaTags from '@components/Common/MetaTags';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { CheckCircleIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { ISuccessResult } from '@worldcoin/idkit';
import { IDKitWidget } from '@worldcoin/idkit';
import { APP_NAME, IDKIT_ACTION_ID, IDKIT_BRIDGE, IS_MAINNET } from 'data/constants';
import { useIsIdKitVerifiedQuery } from 'lens';
import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import SettingsSidebar from '../Sidebar';
import ToggleDispatcher from './ToggleDispatcher';

const DispatcherSettings: FC = () => {
  const { data: idKitData } = useIsIdKitVerifiedQuery();
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'dispatcher' });
  }, []);

  const handleIDKitVerify = useCallback(
    async (result: ISuccessResult) => {
      const response = await fetch(IDKIT_BRIDGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result,
          is_production: IS_MAINNET,
          action_id: IDKIT_ACTION_ID,
          signal: currentProfile?.ownedBy
        })
      });

      if (response.ok) {
        return;
      }

      if (response.status === 400 && (await response.json()).code === 'already_verified') {
        throw new Error(
          'You have already verified this phone number with Lens. You can only verify one wallet with one phone number.'
        );
      }

      throw new Error('Something went wrong. Please try again.');
    },
    [currentProfile?.ownedBy]
  );

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Dispatcher • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-4">
        <Card className="linkify space-y-2 p-5">
          <div className="flex items-center space-x-2">
            <div className="text-lg font-bold">
              {currentProfile?.dispatcher?.canUseRelay ? 'Disable' : 'Enable'} dispatcher
            </div>
          </div>
          <div className="pb-2">
            <Trans>
              We suggest you to enable dispatcher so you don't need to sign all your transactions in{' '}
              {APP_NAME}.
            </Trans>
          </div>
          <ToggleDispatcher />
        </Card>
        {currentProfile?.dispatcher?.canUseRelay && !idKitData?.isIDKitPhoneVerified && (
          <Card className="linkify space-y-2 p-5">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold">Unlock higher dispatcher limits</div>
            </div>
            <div className="pb-2">
              <Trans>By verifying your phone number, we'll relax the gass-less limits.</Trans>
            </div>
            <IDKitWidget
              enableTelemetry
              methods={['phone', 'orb']}
              actionId={IDKIT_ACTION_ID}
              handleVerify={handleIDKitVerify}
              signal={currentProfile?.ownedBy}
              copy={{
                title: 'Lens Dispatcher',
                heading: t`Verify your phone number to increase gassless limits`
              }}
            >
              {({ open }) => (
                <Button
                  onClick={open}
                  variant="primary"
                  className="mr-auto"
                  icon={<CheckCircleIcon className="h-4 w-4" />}
                >
                  <Trans>Verify with IDKit</Trans>
                </Button>
              )}
            </IDKitWidget>
          </Card>
        )}
      </GridItemEight>
    </GridLayout>
  );
};

export default DispatcherSettings;
