import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { SETTINGS } from '@hey/data/tracking';
import {
  Button,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Spinner
} from '@hey/ui';
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import useProfileStore from '@persisted/useProfileStore';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useContractWrite } from 'wagmi';

import CountdownTimer from './CountdownTimer';
import IndexStatus from './IndexStatus';

const ProtectProfile: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const handleWrongNetwork = useHandleWrongNetwork();

  const onError = (error: any) => {
    errorToast(error);
  };

  const { data, write, isLoading } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'enableTokenGuardian',
    onSuccess: () => {
      Leafwatch.track(SETTINGS.DANGER.PROTECT_PROFILE);
    },
    onError
  });

  if (!currentProfile?.guardian || currentProfile?.guardian?.protected) {
    return null;
  }

  const coolOffDate = new Date(currentProfile?.guardian?.cooldownEndsOn);
  const coolOffTime = new Date(
    coolOffDate.getTime() + 5 * 60 * 100
  ).toISOString();
  const isCoolOffPassed = new Date(coolOffDate).getTime() < Date.now();

  const handleProtect = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      return await write();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="border-b border-red-300 bg-red-500/20">
      <GridLayout className="!p-5">
        <GridItemEight className="!mb-0 space-y-1">
          <div className="flex items-center space-x-2 text-red-700">
            <LockOpenIcon className="h-5 w-5" />
            <div className="text-base font-bold sm:text-lg">
              Attention! Your profile is currently unlocked.
            </div>
          </div>
          <div className="text-red-500">
            {isCoolOffPassed ? (
              <>
                Your profile protection disabled.
                <Link
                  className="ml-1.5 underline"
                  to="https://github.com/lens-protocol/LIPs/blob/main/LIPs/lip-4.md"
                  target="_blank"
                >
                  Learn more
                </Link>
              </>
            ) : (
              <>
                Your profile protection disabling has been triggered. It will
                take effect in{' '}
                <b>
                  <CountdownTimer targetDate={coolOffTime} />
                </b>
              </>
            )}
          </div>
        </GridItemEight>
        <GridItemFour className="mt-5 flex items-center sm:ml-auto sm:mt-0">
          {data?.hash ? (
            <IndexStatus txHash={data?.hash} reload />
          ) : (
            <Button
              disabled={isLoading}
              icon={
                isLoading ? (
                  <Spinner size="xs" />
                ) : (
                  <LockClosedIcon className="h-4 w-4" />
                )
              }
              onClick={handleProtect}
            >
              Protect now
            </Button>
          )}
        </GridItemFour>
      </GridLayout>
    </div>
  );
};

export default ProtectProfile;
